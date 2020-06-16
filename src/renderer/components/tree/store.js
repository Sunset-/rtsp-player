const URLS = {
	//根据组织id查询下级组织、设备、卡口
	URM_TREE: "/api/organization/tree_posterity",
	//资源分组下的资源数量以及在离线设备数量统计
	URM_TREE_RESOURCEcOUNT: "/api/resource/resourceStatusStatistics",
	//根据组织id查询子孙组织、设备、卡口
	URM_TREE_POSTERITY: "/api/organization/tree_posterity",
	//根据设备ids查询祖先组织集合
	URM_TREE_ANCESTORS: "/api/organization/tree_ancestors",
	//根据组织id查询下级组织
	URM_ORG_TREE: "/api/organization/tree",
	//根据组织类型获取所有组织
	ORG_ALL: "/api/organization/organization_search",
	checkOrgDelete: "/api/organization/checkOrgDelete" // 校验组织下是都有子组织或者设备/卡口
};

const RESOURCE_TYPE_ORG = 1,
	RESOURCE_TYPE_EQUIPMENT = 2,
	RESOURCE_TYPE_TOLLGATE = 3;

const ACCESSTYPE_DAG = 4;

var cache = {};

export default {
	RESOURCE_TYPE_ORG,
	RESOURCE_TYPE_EQUIPMENT,
	RESOURCE_TYPE_TOLLGATE,
	tree(url, filter) {
		filter.isAdmin = true;
		filter.treeLevel = filter.treeLevel ? filter.treeLevel : 0;
		return $http({
			url: `http://${url}${URLS.URM_TREE}`,
			type: "POST",
			data: filter
		});
	},
	search(url, keyword, orgType) {
		return $http({
			url: `http://${url}${URLS.URM_TREE_POSTERITY}`,
			type: "POST",
			data: {
				isAdmin: true,
				orgType: orgType,
				keyword: keyword,
				treeLevel: 1,
				nodeType: "2,3"
			}
		});
	},
	asyncTree(url, filter) {
		filter.treeLevel = 1;
		filter.isAdmin = true;
		return $http({
			url: `http://${url}${URLS.URM_TREE}`,
			type: "POST",
			data: filter
		});
	},
	asyncTree1(url, filter, isStatistics) {
		filter.treeLevel = 1;
		filter.isAdmin = true;
		return Promise.all([
			isStatistics === false
				? Promise.resolve([])
				: $http({
						url: `http://${url}${URLS.URM_TREE_RESOURCEcOUNT}`,
						type: "POST",
						data: {
							orgType: filter.orgType,
							statisticsLevel: 1,
							// 'type': filter.orgType == 1 ?$dictionary.getEnums('EQUIPMENT_TYPE').map((item => {
							// 	return item.value
							// })): [2],
							isAdmin: true
						}
				  }),
			$http({
				url: `http://${url}${URLS.URM_TREE}`,
				type: "POST",
				data: filter
			})
		]).then(res => {
			let total = res[0].reduce((res, item) => {
				res[item.orgId] = item;
				return res;
			}, {});
			if (total) {
				res[1].forEach(item => {
					item.resourceCount = total[item.id] ? total[item.id].resourceCount : "" || "";
				});
			}
			return res[1];
		});
	},
	checkOrgDelete(url, model) {
		return $http({
			url: `${URLS["checkOrgDelete"]}/${model.orgId}/${model.orgType}`,
			type: "get"
		});
	},
	loadPosterity(url, parentId, orgType) {
		return $http({
			url: `http://${url}${URLS.URM_TREE_POSTERITY}`,
			type: "POST",
			data: {
				treeLevel: 1,
				ids: [parentId],
				orgType: orgType,
				nodeType: "1,2,3",
				isAdmin: true
			}
		});
	},
	loadAncestors(url, ids, orgType) {
		return $http({
			url: `http://${url}${URLS.URM_TREE_ANCESTORS}`,
			type: "POST",
			data: {
				treeLevel: 0,
				ids: Sunset.isString(ids) ? ids.split(",") : ids || [],
				orgType: orgType,
				nodeType: "1",
				isAdmin: true
			}
		});
	},
	allEquipmentOrg(url) {
		return this.asyncTree({
			orgType: "1",
			nodeType: "1"
		});
	},
	orgTree(url, parentId, orgType) {
		return $http({
			url: `http://${url}${URLS.URM_ORG_TREE}`,
			type: "POST",
			data: {
				accessType: ACCESSTYPE_DAG,
				ownerType: ACCESSTYPE_DAG,
				treeLevel: 0,
				ids: [parentId],
				orgId: parentId,
				nodeType: RESOURCE_TYPE_ORG,
				orgType: orgType,
				isAdmin: true
			}
		}).then(res => {
			return (
				res &&
				res.map(item => {
					item.nodeType = RESOURCE_TYPE_ORG;
					return item;
				})
			);
		});
	}
};
