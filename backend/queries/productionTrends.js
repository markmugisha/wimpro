import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData.js';

dayjs.extend(localeData);

const query = `
--sql Highlight
select
	gt.name,
  date_part('month',
		dp.production_date) as month,
	cast (sum(dp.total_weight) as float) as produced
from
	daily_production dp
	inner join grain_type gt on gt.id = dp.grain_type_id
where
	branch_id = :branchId
	and date_part('year', dp.production_date) = :year
group by
	gt.name,
  month;
`;

const format = (data) => {
  const keys = new Set();
  const result = {
    data: dayjs.monthsShort().map((name) => ({ name })),
  };

  data.forEach((d) => {
    result.data[d.month - 1][d.name] = d.produced;
    keys.add(d.name);
  });

  result.keys = Array.from(keys);

  return result;
};

export { query, format };
