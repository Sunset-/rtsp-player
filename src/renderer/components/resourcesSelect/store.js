const URLS = {
    LIST: "/api/dag/v2/resource/group/list", // 分组查询
    RESOURCEBYGROUP: "/api/dag/v2/resource/group/getResourceIdsByGroupIds", // 分组查询
};
export default {
    list(filter = {}) {
        return $http({
            url: URLS.LIST,
            type: "post",
            data: filter
        });
    },
    getResourceIdsByGroupIds(filter = {}) {
        return $http({
            url: URLS.RESOURCEBYGROUP,
            type: "post",
            data: filter
        });
    },
};