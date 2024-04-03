import dayjs from "dayjs";
import localeData from 'dayjs/plugin/localeData.js';

dayjs.extend(localeData);

const query =   
`
--sql
select
	name,
	month,
	cast (SUM(received) as float) as received,
	cast (SUM(produced) as float) as produced
from
	(
	select
		gt.name,
		date_part('month',
		cr.date_created) as month,
		SUM(cr.net_weight) as received,
		0 as produced
	from
		commodity_receipt cr
	inner join
            received_product rp on
		rp.lot_id = cr.lot_id
	inner join
            grain_type gt on                         
		gt.id = rp.grain_type_id
	where
		branch_id = 4
		and DATE_PART('year',
		rp.date_created) = 2023
	group by
		gt.name,
		month
union
	select
		gt.name,
		date_part('month',
		dp.production_date) as month,
		0 as received,
		SUM(dp.total_weight) as produced
	from
		daily_production dp
	inner join
            grain_type gt on
		gt.id = dp.grain_type_id
	where
		branch_id = :branchId
		and DATE_PART('year',
		dp.production_date) = :year
	group by
		gt.name,
		month
    ) as merged_data
group by
	name,
	month;
`

const format = (data) => {
  const result = {
    keys: {},
    data: dayjs.monthsShort().map(name => ({name}))
  }
  data.forEach(d => {
    const producedKey = `${d.name} Produced`
    const receivedKey = `${d.name} Received`
    result.data[d.month - 1][producedKey] = d.produced;
    result.data[d.month - 1][receivedKey] = d.received;
    result.keys[`${d.name} Produced`] = d.name.toLowerCase();
    result.keys[`${d.name} Received`] = d.name.toLowerCase();
  })
  return result;
}

export {query ,format};