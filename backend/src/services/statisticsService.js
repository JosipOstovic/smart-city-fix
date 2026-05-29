const db = require('../config/database');

module.exports = {
  async getStatistics() {
    // Total issues by status
    const byStatus = await db('issues')
      .select('status')
      .count('id as count')
      .groupBy('status');

    const statusMap = { reported: 0, in_progress: 0, resolved: 0, rejected: 0 };
    byStatus.forEach(row => { statusMap[row.status] = parseInt(row.count); });
    const totalIssues = Object.values(statusMap).reduce((a, b) => a + b, 0);

    // By category
    const byCategory = await db('issues')
      .join('categories', 'issues.category_id', 'categories.id')
      .select('categories.name as category_name')
      .count('issues.id as count')
      .groupBy('categories.name')
      .orderBy('count', 'desc');

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await db('issues')
      .select(db.raw("to_char(created_at, 'YYYY-MM') as month"))
      .count('id as count')
      .where('created_at', '>=', sixMonthsAgo)
      .groupByRaw("to_char(created_at, 'YYYY-MM')")
      .orderBy('month', 'asc');

    // Top locations (group by address, top 5)
    const topLocations = await db('issues')
      .select('address', 'latitude', 'longitude')
      .count('id as count')
      .whereNotNull('address')
      .groupBy('address', 'latitude', 'longitude')
      .orderBy('count', 'desc')
      .limit(5);

    // Average resolution time (in hours)
    const avgResolution = await db('status_history')
      .join('issues', 'status_history.issue_id', 'issues.id')
      .where('status_history.new_status', 'resolved')
      .select(db.raw("avg(extract(epoch from (status_history.created_at - issues.created_at)) / 3600) as avg_hours"))
      .first();

    return {
      total_issues: totalIssues,
      by_status: statusMap,
      by_category: byCategory.map(r => ({ category_name: r.category_name, count: parseInt(r.count) })),
      monthly_trend: monthlyTrend.map(r => ({ month: r.month, count: parseInt(r.count) })),
      top_locations: topLocations.map(r => ({
        address: r.address, latitude: parseFloat(r.latitude),
        longitude: parseFloat(r.longitude), count: parseInt(r.count)
      })),
      avg_resolution_hours: avgResolution?.avg_hours ? Math.round(parseFloat(avgResolution.avg_hours)) : null
    };
  }
};
