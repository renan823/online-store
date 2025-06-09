import { MontlhySalesReport } from "../../domain/analytics";
import { OrderModel } from "../../models/order";

export async function generateMonthlyReportUseCase(month: number, year: number): Promise<MontlhySalesReport> {
	const start = new Date(year, month - 1, 1);
	const end = new Date(year, month, 1); 

	const orders = await OrderModel.aggregate([
		{
			$match: {
				createdAt: {
					$gte: start,
					$lt: end,
				}
			}
		},
		{
			$facet: {
				totalOrders: [{ $count: 'count' }],
				totalRevenue: [
					{ $group: { _id: null, total: { $sum: '$total' } } }
				],
				statusBreakdown: [
					{ $group: { _id: '$status', count: { $sum: 1 } } }
				],
				topProducts: [
					{ $unwind: '$items' },
					{
						$group: {
							_id: '$items.product._id',
							name: { $first: '$items.product.name' },
							totalSold: { $sum: '$items.quantity' }
						}
					},
					{ $sort: { totalSold: -1 } },
					{ $limit: 10 }
				],
				dailySales: [
					{
						$group: {
							_id: { $dayOfMonth: '$createdAt' },
							total: { $sum: '$total' }
						}
					},
					{ $sort: { _id: 1 } },
					{
						$project: {
							day: '$_id',
							total: 1,
							_id: 0
						}
					}
				]
			}
		}
	]);

	const result = orders[0];

	return {
		totalOrders: result.totalOrders[0]?.count || 0,
		totalRevenue: result.totalRevenue[0]?.total || 0,
		statusBreakdown: result.statusBreakdown,
		topProducts: result.topProducts,
		dailySales: result.dailySales,
	};
}
