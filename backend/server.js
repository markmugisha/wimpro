import 'dotenv/config';
import './models/index.js';

import fs from 'node:fs';

// import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import passport from 'passport';
import passportLocal from 'passport-local';
import session from 'cookie-session';
import morgan from 'morgan';
import { Op } from 'sequelize';

import sequelize from './models/sequelize.js';
import {
  Organization,
  User,
  UserRole,
  VerificationToken,
  Branch,
  ReceivedProduct,
  Supplier,
  GrainType,
  CommodityReceipt,
  QAData,
  Silo,
  DailyProduction,
  ProductionInventory,
  Role,
  Order,
  ReceivedStock,
  OrderItem,
  Batch,
  BatchItem,
  Fumigation,
} from './models/index.js';
import {
  ApiError,
  DuplicateBatchNumberError,
  DuplicateBranchName,
  DuplicateEmail,
  DuplicateGrainTypeError,
  DuplicateStartDate,
  InsufficientSiloInventoryError,
  InvalidBatchNumberError,
  InvalidOrderError,
  InvalidStackNumberError,
  InvalidVerificationTokenError,
  InvalidatedPickingPlanError,
  NoSiloInventoryError,
  OrderCannotBeSatisfiedError,
} from './errors/index.js';
import {
  deserializeUser,
  localStrategyHandler,
  serializeUser,
} from './auth/passport.js';
import { ensureLoggedIn } from './auth/middleware.js';
import generateRandomPassword from './auth/generateRandomPassword.js';
import {
  getProductionTrends,
  getReceivedVsProducedTrends,
} from './queries/queries.js';
import orderPickingPlan from './queries/orderPickingPlan.js';

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://localhost'],
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
);
const regenerate = (callback) => {
  callback();
};
const save = (callback) => {
  callback();
};
app.use((req, res, next) => {
  req.session.regenerate = regenerate;
  req.session.save = save;
  next();
});
app.use(passport.initialize());
app.use(passport.session());

const { Strategy: LocalStrategy } = passportLocal;
passport.use(
  new LocalStrategy({ usernameField: 'email' }, localStrategyHandler)
);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.get('/', (req, res) => {
  res.json({ message: 'Hello from WIM PRO server!' });
});

// receive produce route!
app.post('/add-received-produce', ensureLoggedIn(), async (req, res, next) => {
  const product = req.body;
  // TODO: change to branchId, but first create relationship between ReceivedProduct and Branch
  product.branchId = req.user.branchId;

  try {
    const newProduct = await ReceivedProduct.create(product);

    // console.log(`This is your product Lot ID: ${newProduct.lotId}`);
    res.json(newProduct);
  } catch (error) {
    next(error);
  }
});

app.post('/create-organization', async (req, res, next) => {
  const { admin, organization } = req.body;

  try {
    const existingEmail = await User.findOne({
      where: { email: admin.email },
    });
    if (existingEmail) {
      return next(new DuplicateEmail());
    }
    await sequelize.transaction(async (t) => {
      const newOrganization = (
        await Organization.create(organization, {
          transaction: t,
        })
      ).toJSON();

      const newAdmin = (
        await User.create(
          {
            ...admin,
            // TODO: hash password
            organizationId: newOrganization.id,
          },
          { transaction: t }
        )
      ).toJSON();
      delete newAdmin.password;

      await UserRole.create(
        { userId: newAdmin.id, role: 'sys_admin' },
        { transaction: t }
      );

      const { token } = await VerificationToken.create(
        {
          userId: newAdmin.id,
        },
        { transaction: t }
      );

      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'americo.orn@ethereal.email',
          pass: 'FU3skdf1NVsnm2hMRc',
        },
      });

      //       await transporter.sendMail({
      //         from: '"Agripoint Admin" <admin@agripoint.com>',
      //         to: newAdmin.email,
      //         subject: 'Verify your account',
      //         text: `Hello there, the organization ${newOrganization.name} has been successfully created.
      // To get started, verify the admin account by clicking the link below.
      // http://localhost:5173/verify/${token}
      // `,
      //         html: `Hello there, the organization <b>${newOrganization.name}</b> has been successfully created.
      // To get started, verify the admin account using the link below. <br />
      // <a href="http://localhost:5173/verify/${token}">
      //   http://localhost:5173/verify/${token}
      // </a>
      // `,
      //       });

      // user in response has no roles
      console.log(
        `Email link for ${newOrganization.name}: http://localhost:5173/verify/${token}`
      );
      res.json({
        admin: newAdmin,
        organization: newOrganization,
      });
    });
  } catch (error) {
    next(error);
  }
});

const stream =
  process.env.NODE_ENV === 'development'
    ? fs.createWriteStream('./dev/passwords.txt', { flags: 'a' })
    : null;
app.post('/create-user', ensureLoggedIn(), async (req, res, next) => {
  const user = req.body;
  const generatedPassword = generateRandomPassword(6, 8);
  user.password = generatedPassword;
  user.organizationId = req.user.organizationId;
  user.isVerified = true;

  try {
    const existingEmail = await User.findOne({
      where: { email: user.email },
    });
    if (existingEmail) {
      return next(new DuplicateEmail());
    }
    await sequelize.transaction(async (t) => {
      const newUser = await User.create(user, { transaction: t });
      await UserRole.create(
        { userId: newUser.id, role: user.role },
        { transaction: t }
      );
      stream?.write(`${user.role}\n${user.email}\n${generatedPassword}\n\n`);

      res.json(newUser);
    });
  } catch (error) {
    next(error);
  }
});
/*
The API below facilitates the system creation of a new warehouse branch. A warehouse branch must be attached to or under an umbrella or parent organization. This implies that each warehouse branch created must have or be associated with an organizationId. Notice that the req.body assigned to the variable warehouse does not contain the organizationId. But passport ensures that the user creating the warehouse is logged in under a respective organization. Therefore, the organizationId is passed on to the new warehouse branch from the logged in user creating the branch.This is the same as in creating a new user in the API above.
*/
app.post('/create-warehouse', ensureLoggedIn(), async (req, res, next) => {
  const warehouse = req.body;
  warehouse.organizationId = req.user.organizationId;

  try {
    const existingWarehouse = await Branch.findOne({
      where: { name: warehouse.name, organizationId: warehouse.organizationId },
    });
    if (existingWarehouse) {
      return next(new DuplicateBranchName());
    }
    const newWarehouse = await Branch.create(warehouse);
    console.log(`This is your new branch name: ${newWarehouse.name}`);
    res.json(newWarehouse);
  } catch (error) {
    next(error);
  }
});

// *****Supplier API*****
app.post('/create-supplier', ensureLoggedIn(), async (req, res, next) => {
  const supplier = req.body;
  supplier.organizationId = req.user.organizationId;
  try {
    const existingEmail = await Supplier.findOne({
      where: { email: supplier.email },
    });
    if (existingEmail) {
      return next(new DuplicateEmail());
    }
    const newSupplier = await Supplier.create(supplier);
    console.log(`This is your new branch name: ${newSupplier.name}`);
    res.json(newSupplier);
  } catch (error) {
    next(error);
  }
});
// *****Grain Type API*****
app.post('/create-graintype', ensureLoggedIn(), async (req, res, next) => {
  const grainType = req.body;
  grainType.organizationId = req.user.organizationId;

  try {
    const existingGrainType = await GrainType.findOne({
      where: { name: grainType.name, organizationId: grainType.organizationId },
    });
    if (existingGrainType) {
      return next(new DuplicateGrainTypeError());
    }

    const newGrainType = await GrainType.create(grainType);
    console.log(`This is your new Grain type: ${newGrainType.name}`);

    res.json(newGrainType);
  } catch (error) {
    next(error);
  }
});

// *****Commodity Receipt API*****
app.post('/first-mass', ensureLoggedIn(), async (req, res, next) => {
  const commodityReceiptData = req.body;

  try {
    await sequelize.transaction(async (t) => {
      const newCommodityReceipt = await CommodityReceipt.create(
        commodityReceiptData,
        { transaction: t }
      );

      await ReceivedProduct.update(
        { status: 'weighed-first' },
        { where: { lotId: newCommodityReceipt.lotId }, transaction: t }
      );

      res.json(newCommodityReceipt);
    });
  } catch (error) {
    next(error);
  }
});

app.post('/second-mass', ensureLoggedIn(), async (req, res, next) => {
  const commodityReceiptUpdate = req.body;

  try {
    await sequelize.transaction(async (t) => {
      const commodityReceipt = await CommodityReceipt.findOne({
        where: { lotId: commodityReceiptUpdate.lotId },
        transaction: t,
        include: ReceivedProduct,
      });

      await commodityReceipt.update(commodityReceiptUpdate, { transaction: t });

      await commodityReceipt.receivedProduct.update(
        { status: 'weighed-final' },
        { transaction: t }
      );

      const siloEntry = await Silo.findOne({
        where: {
          branchId: req.user.branchId,
          grainTypeId: commodityReceipt.receivedProduct.grainTypeId,
        },
        transaction: t,
      });

      if (siloEntry) {
        await siloEntry.increment('total', {
          by: commodityReceipt.netWeight,
          transaction: t,
        });
      } else {
        await Silo.create(
          {
            branchId: req.user.branchId,
            grainTypeId: commodityReceipt.receivedProduct.grainTypeId,
            total: commodityReceipt.netWeight,
          },
          { transaction: t }
        );
      }

      res.json(commodityReceipt);
    });
  } catch (error) {
    next(error);
  }
});

app.post('/qa-data', ensureLoggedIn(), async (req, res, next) => {
  const qaData = req.body;

  try {
    await sequelize.transaction(async (t) => {
      const newQaData = await QAData.create(qaData, { transaction: t });

      await ReceivedProduct.update(
        { status: 'assessed' },
        { where: { lotId: newQaData.lotId }, transaction: t }
      );

      res.json(newQaData);
    });
  } catch (error) {
    next(error);
  }
});

app.put('/qa-data/:id', ensureLoggedIn(), async (req, res, next) => {
  const qaData = req.body;
  const id = req.params.id;

  try {
    const newQaData = await QAData.update(qaData, { where: { id } });

    res.json(newQaData);
  } catch (error) {
    next(error);
  }
});

app.post('/batch', ensureLoggedIn(), async (req, res, next) => {
  const batch = req.body;
  batch.branchId = req.user.branchId;
  batch.isActive = true;

  try {
    await sequelize.transaction(async (t) => {
      const batchExistsForOrganization = await Batch.findOne({
        where: {
          batchNumber: batch.batchNumber,
        },
        include: {
          model: Branch,
          where: { organizationId: req.user.organizationId },
        },
        transaction: t,
      });

      if (batchExistsForOrganization) {
        return next(new DuplicateBatchNumberError());
      }

      await Batch.update(
        { isActive: false },
        {
          where: {
            grainTypeId: batch.grainTypeId,
            branchId: batch.branchId,
            isActive: true,
          },
          transaction: t,
        }
      );

      const newBatch = await Batch.create(batch, {
        transaction: t,
      });

      res.json(newBatch);
    });
  } catch (error) {
    next(error);
  }
});

app.post('/daily-production', ensureLoggedIn(), async (req, res, next) => {
  const dailyProduction = req.body;
  dailyProduction.branchId = req.user.branchId;

  try {
    await sequelize.transaction(async (t) => {
      const batchExistsForBranch = await Batch.findOne({
        where: {
          batchNumber: dailyProduction.batchNumber,
          branchId: dailyProduction.branchId,
        },
        transaction: t,
      });

      if (!batchExistsForBranch) {
        return next(new InvalidBatchNumberError());
      }

      const siloEntry = await Silo.findOne({
        where: {
          branchId: req.user.branchId,
          grainTypeId: dailyProduction.grainTypeId,
        },
        transaction: t,
      });

      if (!siloEntry) {
        return next(new NoSiloInventoryError());
      }

      if (siloEntry.total < dailyProduction.totalWeight) {
        return next(new InsufficientSiloInventoryError());
      }

      const newDailyProduction = await DailyProduction.create(dailyProduction, {
        transaction: t,
      });

      const productionEntry = await ProductionInventory.findOne({
        where: {
          branchId: req.user.branchId,
          grainTypeId: dailyProduction.grainTypeId,
        },
        transaction: t,
      });

      if (productionEntry) {
        await productionEntry.increment('total', {
          by: dailyProduction.totalWeight,
          transaction: t,
        });
      } else {
        await ProductionInventory.create(
          {
            branchId: req.user.branchId,
            grainTypeId: dailyProduction.grainTypeId,
            total: dailyProduction.totalWeight,
          },
          { transaction: t }
        );
      }

      await siloEntry.decrement('total', {
        by: dailyProduction.totalWeight,
        transaction: t,
      });

      res.json(newDailyProduction);
    });
  } catch (error) {
    next(error);
  }
});

app.post('/order', ensureLoggedIn(), async (req, res, next) => {
  const order = req.body;
  console.log(order);
  order.branchId = req.user.branchId;

  try {
    await sequelize.transaction(async (t) => {
      const newOrder = await Order.create(order, {
        transaction: t,
        include: [{ association: Order.OrderItems }],
      });

      res.json(newOrder);
    });
  } catch (error) {
    next(error);
  }
});

app.post('/received-stock', ensureLoggedIn(), async (req, res, next) => {
  const stock = req.body;

  try {
    await sequelize.transaction(async (t) => {
      const dailyProduction = await DailyProduction.findByPk(
        stock.dailyProductionId,
        {
          transaction: t,
        }
      );

      const existingBatchItem = await BatchItem.findOne({
        where: {
          batchNumber: dailyProduction.batchNumber,
          stackNumber: stock.stackNumber,
        },
        transaction: t,
      });

      if (existingBatchItem) {
        if (existingBatchItem.weightPerBag !== dailyProduction.weightPerBag) {
          return next(new InvalidStackNumberError());
        }
        await existingBatchItem.increment('numberOfBags', {
          by: dailyProduction.numberOfBags,
          transaction: t,
        });
      } else {
        await BatchItem.create(
          {
            batchNumber: dailyProduction.batchNumber,
            stackNumber: stock.stackNumber,
            weightPerBag: dailyProduction.weightPerBag,
            numberOfBags: dailyProduction.numberOfBags,
          },
          { transaction: t }
        );
      }

      await dailyProduction.update({ status: 'received' }, { transaction: t });

      res.json();
    });
  } catch (error) {
    next(error);
  }
});

// *****Fumigation API*****
app.post('/fumigation', ensureLoggedIn(), async (req, res, next) => {
  const fumigate = req.body;
  try {
    const existingStackDate = await Fumigation.findOne({
      where: {
        startDate: fumigate.startDate,
        batchItemId: fumigate.batchItemId,
      },
    });
    if (existingStackDate) {
      return next(new DuplicateStartDate());
    }
    const fumigation = await Fumigation.create(fumigate);
    console.log(`Our fumigation date is set to: ${fumigate.startDate}`);
    res.json(fumigation);
  } catch (error) {
    next(error);
  }
});

app.post('/verify/:token', ensureLoggedIn(), async (req, res, next) => {
  const candidateToken = req.params.token;
  const user = req.user;

  if (user.isVerified) {
    return res.json(req.user);
  }

  try {
    await sequelize.transaction(async (t) => {
      const verificationToken = await VerificationToken.findOne({
        where: { token: candidateToken },
        transaction: t,
      });

      if (!verificationToken || verificationToken.userId !== user.id) {
        return next(new InvalidVerificationTokenError());
      }

      await User.update(
        { isVerified: true },
        { where: { id: user.id }, transaction: t }
      );

      await verificationToken.destroy({ transaction: t });

      req.user.isVerified = true;
      return res.json(req.user);
    });
  } catch (error) {
    return next(error);
  }
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    req.login(user, (err) => {
      if (err) return next(err);
      res.json(req.user);
    });
  })(req, res, next);
});

app.post('/logout', function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({});
  });
});

// AND electricity flowing/ or not -> 0,1 Boolean Logic, Boolean Math

app.get('/current-user', (req, res) => {
  res.json(req.user);
});

app.get('/company-secrets', ensureLoggedIn(), (req, res, next) => {
  res.json({
    secrets: 'Santa Claus is not real. But the tooth fairy is vry much real.',
  });
});

app.get('/branches', ensureLoggedIn(), async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const branches = await Branch.findAll({ where: { organizationId: orgId } });

    res.json(branches);
  } catch (error) {
    next(error);
  }
});

app.get('/suppliers', ensureLoggedIn(), async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const suppliers = await Supplier.findAll({
      where: { organizationId: orgId },
    });

    res.json(suppliers);
  } catch (error) {
    next(error);
  }
});

app.get('/grain-types', ensureLoggedIn(), async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const grainTypes = await GrainType.findAll({
      where: { organizationId: orgId },
    });

    res.json(grainTypes);
  } catch (error) {
    next(error);
  }
});

app.get('/received-produce', ensureLoggedIn(), async (req, res, next) => {
  try {
    const branchId = req.user.branchId;
    const receivedProduce = await ReceivedProduct.findAll({
      where: { branchId },
      attributes: ['lotId', 'dateCreated'],
      include: [
        {
          model: Supplier,
          attributes: ['id', 'name'],
        },
        {
          model: GrainType,
          attributes: ['id', 'name'],
        },
      ],
    });

    res.json(receivedProduce);
  } catch (error) {
    next(error);
  }
});

app.get('/user-account', ensureLoggedIn(), async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const userAccounts = await User.findAll({
      where: { organizationId: orgId },
      attributes: ['firstName', 'lastName', 'phoneNumber', 'email'],
      include: [
        {
          model: Role,
          where: { type: 'warehouse' },
          attributes: ['name'],
          through: {
            attributes: [],
          },
        },
        {
          model: Branch,
          attributes: ['name'],
        },
      ],
    });

    res.json(userAccounts);
  } catch (error) {
    next(error);
  }
});

app.get('/pending-first-mass', ensureLoggedIn(), async (req, res, next) => {
  try {
    const branchId = req.user.branchId;

    const receivedProducts = await ReceivedProduct.findAll({
      where: { branchId, status: 'received' },
      include: [
        {
          model: CommodityReceipt,
        },
        { model: Supplier, attributes: ['id', 'name'] },
        {
          model: GrainType,
          attributes: ['id', 'name'],
        },
      ],
    });

    res.json(receivedProducts);
  } catch (error) {
    next(error);
  }
});
app.get('/pending-qa', ensureLoggedIn(), async (req, res, next) => {
  try {
    const branchId = req.user.branchId;

    const receivedProducts = await ReceivedProduct.findAll({
      where: { branchId, status: 'weighed-first' },
      include: [
        {
          model: CommodityReceipt,
        },
        { model: Supplier, attributes: ['id', 'name'] },
        {
          model: GrainType,
          attributes: ['id', 'name'],
        },
      ],
    });

    res.json(receivedProducts);
  } catch (error) {
    next(error);
  }
});

app.get('/pending-second-mass', ensureLoggedIn(), async (req, res, next) => {
  try {
    const branchId = req.user.branchId;

    const receivedProducts = await ReceivedProduct.findAll({
      where: { branchId, status: 'assessed' },
      include: [
        {
          model: QAData,
        },
        {
          model: CommodityReceipt,
        },
        { model: Supplier, attributes: ['id', 'name'] },
        {
          model: GrainType,
          attributes: ['id', 'name'],
        },
      ],
    });

    res.json(receivedProducts);
  } catch (error) {
    next(error);
  }
});

app.get('/commodity-receipts', ensureLoggedIn(), async (req, res, next) => {
  try {
    const branchId = req.user.branchId;

    const commodityReceipts = await CommodityReceipt.findAll({
      include: [
        {
          model: ReceivedProduct,
          where: { branchId, status: 'weighed-final' },
          include: [
            {
              model: QAData,
            },
            { model: Supplier, attributes: ['id', 'name'] },
            {
              model: GrainType,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    res.json(commodityReceipts);
  } catch (error) {
    next(error);
  }
});

app.get('/silos', ensureLoggedIn(), async (req, res, next) => {
  const branchId = req.user.branchId;

  try {
    const silos = await Silo.findAll({
      where: { branchId },
      include: GrainType,
    });

    res.json(silos);
  } catch (error) {
    next(error);
  }
});

app.get('/daily-production', ensureLoggedIn(), async (req, res, next) => {
  try {
    const branchId = req.user.branchId;

    const dailyProduction = await DailyProduction.findAll({
      where: { branchId },
      include: [
        {
          model: GrainType,
          attributes: ['id', 'name'],
        },
      ],
    });

    res.json(dailyProduction);
  } catch (error) {
    next(error);
  }
});

app.get(
  '/received-produce-trends',
  ensureLoggedIn(),
  async (req, res, next) => {
    try {
      const branchId = req.user.branchId;
      const year = req.query.year;

      const receivedProduceTrends = await ReceivedProduct.findAll({
        where: { branchId, status: 'weighed-final' },
        attributes: [
          [
            sequelize.fn(
              'date_part',
              'month',
              sequelize.col('commodityReceipt.date_created')
            ),
            'month',
          ],
          [
            sequelize.fn(
              'date_part',
              'year',
              sequelize.col('commodityReceipt.date_created')
            ),
            'year',
          ],
          [sequelize.col('grainType.name'), 'grainTypeName'],
          [
            sequelize.fn('sum', sequelize.col('commodityReceipt.net_weight')),
            'totalNetWeight',
          ],
        ],
        include: [
          {
            model: CommodityReceipt,
            attributes: [],
            where: sequelize.where(
              sequelize.fn(
                'date_part',
                'year',
                sequelize.col('commodityReceipt.date_created')
              ),
              year
            ),
          },
          {
            model: GrainType,
            attributes: [],
          },
        ],
        group: ['grainTypeName', 'month', 'year'],
        raw: true,
      });

      res.json(receivedProduceTrends);
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  '/received-vs-produced-trend',
  ensureLoggedIn(),
  async (req, res, next) => {
    const { branchId } = req.user;
    const { year } = req.query;

    try {
      const trend = await getReceivedVsProducedTrends({ branchId, year });
      res.json(trend);
    } catch (error) {
      next(error);
    }
  }
);

app.get('/production-trends', ensureLoggedIn(), async (req, res, next) => {
  const { branchId } = req.user;
  const { year } = req.query;

  try {
    const trends = await getProductionTrends({ branchId, year });
    res.json(trends);
  } catch (error) {
    next(error);
  }
});

app.get('/stock-in', ensureLoggedIn(), async (req, res, next) => {
  try {
    const branchId = req.user.branchId;
    const StockIn = await DailyProduction.findAll({
      where: { branchId, status: 'produced' },
      attributes: { exclude: ['totalWeight'] },
      include: [
        {
          model: GrainType,
          attributes: ['name'],
        },
        {
          model: Batch,
          attributes: {
            exclude: ['id', 'batchNumber', 'expiryDate', 'isActive'],
          },
          include: [
            {
              model: BatchItem,
              attributes: ['stackNumber', 'weightPerBag'],
            },
          ],
        },
      ],
      order: [
        ['productionDate', 'ASC'],
        [GrainType, 'name', 'ASC'],
      ],
    });

    res.json(StockIn);
  } catch (error) {
    next(error);
  }
});

app.get('/stock', ensureLoggedIn(), async (req, res, next) => {
  const branchId = req.user.branchId;

  try {
    const batchItems = await BatchItem.findAll({
      where: {
        numberOfBags: {
          [Op.gt]: 0,
        },
      },
      include: [
        {
          model: Batch,
          where: {
            branchId,
          },
          include: GrainType,
        },
      ],
    });

    res.json(batchItems);
  } catch (error) {
    next(error);
  }
});

app.get('/stock-out', ensureLoggedIn(), async (req, res, next) => {
  try {
    const branchId = req.user.branchId;
    const StockIn = await DailyProduction.findAll({
      where: { branchId, status: ['picked'] },
      include: [],
    });

    res.json(StockIn);
  } catch (error) {
    next(error);
  }
});
app.get('/order', ensureLoggedIn(), async (req, res, next) => {
  try {
    const branchId = req.user.branchId;

    const orders = await Order.findAll({
      where: { branchId },
      include: [
        {
          model: OrderItem,
          attributes: ['id', 'numberOfBags', 'weightPerBag', 'totalWeight'],
          include: [
            {
              model: GrainType,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

app.get('/batches', ensureLoggedIn(), async (req, res, next) => {
  const branchId = req.user.branchId;

  try {
    const batches = await Batch.findAll({
      where: { branchId, isActive: true },
      include: GrainType,
    });

    res.json(batches);
  } catch (error) {
    next(error);
  }
});

app.get('/pending-orders', ensureLoggedIn(), async (req, res, next) => {
  try {
    const branchId = req.user.branchId;

    const orders = await Order.findAll({
      where: { branchId, status: 'pending' },
      include: [
        {
          model: OrderItem,
          attributes: ['id', 'numberOfBags', 'weightPerBag', 'totalWeight'],
          include: [
            {
              model: GrainType,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

app.get(
  '/order-picking-plan/:orderId',
  ensureLoggedIn(),
  async (req, res, next) => {
    const orderId = Number(req.params.orderId);
    try {
      const pickingPlan = await orderPickingPlan(orderId);

      res.json(pickingPlan);
    } catch (error) {
      next(error);
    }
  }
);

/**
 *
 */

app.post('/pick-order/:orderId', ensureLoggedIn(), async (req, res, next) => {
  const orderId = Number(req.params.orderId);
  try {
    const pickingPlan = await orderPickingPlan(orderId);

    if (!pickingPlan.isPlanSatisfied) {
      return next(new OrderCannotBeSatisfiedError(pickingPlan));
    }
    await sequelize.transaction(async (t) => {
      for (let i = 0; i < pickingPlan.plan.length; i++) {
        const batchItemIds = pickingPlan.plan[i].bagsPicked.map(
          (stackPick) => stackPick.batchItemId
        );

        const batchItems = await BatchItem.findAll({
          where: { id: batchItemIds },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        await Promise.all(
          pickingPlan.plan[i].bagsPicked.map(
            async (stackPick, batchItemIndex) => {
              const batchItem = batchItems[batchItemIndex];

              const pickedBatchItem = await batchItem.decrement(
                { numberOfBags: stackPick.numberOfBags },
                { transaction: t }
              );

              if (pickedBatchItem.numberOfBags < 0) {
                throw new InvalidatedPickingPlanError();
              }
            }
          )
        );
      }

      await Order.update(
        { status: 'fulfilled' },
        { where: { id: orderId }, transaction: t }
      );

      res.json(null);
    });
  } catch (error) {
    next(error);
  }
});

app.get('*', (req, res) => {
  res.sendFile(fileURLToPath(new URL('./public/index.html', import.meta.url)));
});

// error handler
app.use((err, req, res, next) => {
  const error =
    err instanceof ApiError
      ? err
      : {
          statusCode: 500,
          message: 'Internal Server Error',
          errorCode: 'INTERNAL_SERVER_ERROR',
        };
  console.log(err);
  res.status(error.statusCode).json(error);
});

const port = process.env.PORT || 8000;

await sequelize.sync();

app.listen(port, () => {
  console.log(`WIM-PRO server listening on port ${port}`);
});
