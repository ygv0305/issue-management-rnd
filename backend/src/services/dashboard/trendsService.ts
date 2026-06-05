// Models
import Issue from '../../models/issueSchema.js';

export const getTrends = async () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const sem1Start = new Date(currentYear, 1, 23); // Feb 23
  const sem1End = new Date(currentYear, 5, 19, 23, 59, 59, 999); // Jun 19

  const sem2Start = new Date(currentYear, 6, 13); // Jul 13
  const sem2End = new Date(currentYear, 10, 6, 23, 59, 59, 999); // Nov 6

  let startDate: Date;
  let endDate: Date;

  if (currentDate >= sem1Start && currentDate <= sem1End) {
    startDate = sem1Start;
    endDate = sem1End;
  } else if (currentDate >= sem2Start && currentDate <= sem2End) {
    startDate = sem2Start;
    endDate = sem2End;
  } else {
    return null;
  }

  // Determine the start week and end week of the semester and current week
  const startWeekNumber = Math.floor(
    startDate.getTime() / (1000 * 60 * 60 * 24 * 7),
  );
  const currentWeekNumber = Math.floor(
    currentDate.getTime() / (1000 * 60 * 60 * 24 * 7),
  );
  const endWeekNumber = Math.floor(
    endDate.getTime() / (1000 * 60 * 60 * 24 * 7),
  );
  const totalWeeksElapsed = Math.max(0, currentWeekNumber - startWeekNumber);
  const totalWeeksRemaining = Math.max(0, endWeekNumber - currentWeekNumber);

  // Query up to the current date to avoid showing empty data in the future
  const results = await Issue.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: currentDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $floor: {
            $divide: [
              { $subtract: ['$createdAt', startDate] },
              1000 * 60 * 60 * 24 * 7,
            ],
          },
        },
        submitted: { $sum: 1 },
        resolved: {
          $sum: {
            $cond: [{ $in: ['$status', ['Resolved', 'Closed']] }, 1, 0],
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Map results to week numbers
  const weekDataMap = new Map();
  results.forEach((item) => {
    weekDataMap.set(item._id, {
      submitted: item.submitted,
      resolved: item.resolved,
    });
  });

  const trendsData = [];
  // Loop through every week from start until the current date
  for (let i = 0; i <= totalWeeksElapsed; i++) {
    const data = weekDataMap.get(i);
    if (i + 1 !== 7 && i + 1 !== 8) {
      if (i + 1 >= 9) {
        trendsData.push({
          week: `Week ${i - 1}`,
          submitted: data ? data.submitted : 0,
          resolved: data ? data.resolved : 0,
        });
      } else {
        trendsData.push({
          week: `Week ${i + 1}`,
          submitted: data ? data.submitted : 0,
          resolved: data ? data.resolved : 0,
        });
      }
    } else {
      trendsData.push({
        week: `Break ${i - 5}`,
        submitted: data ? data.submitted : 0,
        resolved: data ? data.resolved : 0,
      });
    }
  }

  // Append the rest of the future weeks (17 weeks in total) with null data to trendsData
  for (let i = 0; i <= totalWeeksRemaining; i++) {
    trendsData.push({
      week: `Week ${i + 9}`,
      submitted: null,
      resolved: null,
    });
  }

  return trendsData;
};
