<template>
	<div>
		<xui-modal ref="modal" :options="modalOptions">
			<resources-select @searchFilter='searchFilter' @onCheckedEquipments='onCheckedEquipments' @onCheckedTollgates='onCheckedTollgates' @tollgateTreeInited='tollgateTreeInited' @equipmentTreeInited='equipmentTreeInited' ref='resourcesSelect' :options='options' @remove='removeTree'></resources-select>
			<div slot="footer" style="margin-top:15px;text-align:right">
				<xui-toolbar :ctx="resources" class='title_btn' :options="toolbarOptions"></xui-toolbar>
			</div>
		</xui-modal>
	</div>
</template>
<script>
/**
 * options
 * @param equipmentTreeOptions 设备树参数
 * @param tollgateTreeOptions 卡口树参数
 * @param toolbarOptions 模态框按钮
 * @param searchFilter 是否有搜索内容
 * @param filterOptions 搜索的配置
 */
import ResourcesSelect from "../resourcesSelect";
export default {
	props: {
		options: {}
	},
	components: {
		ResourcesSelect
	},
	computed: {
		resources() {
			return this.equipments.concat(this.tollgates);
		}
	},
	mounted() {
		console.log(this.$refs);
	},
	data() {
		return {
			equipments: [],
			tollgates: [],
			toolbarOptions: {
				tools: [
					{
						label: "取消",
						color: "normal",
						operate: data => {
							this.close(data);
						}
					},
					{
						label: "确认",
						color: "primary",
						operate: data => {
							this.save(data);
						}
					}
				]
			},
			modalOptions: this.options.modalOptions || {
				title: "选择设备",
				width: 800
			}
		};
	},
	methods: {
		init() {
			this.$refs.resourcesSelect.init();
			this.$refs.modal.open();
			this.toolbarOptions = this.options.toolbarOptions ? this.options.toolbarOptions : this.toolbarOptions;
		},
		searchFilter(filters) {
			this.$emit("searchFilter", filters);
		},
		equipmentTreeInited(rootNode) {
			this.$emit("equipmentTreeInited", rootNode);
		},
		tollgateTreeInited(rootNode) {
			this.$emit("tollgateTreeInited", rootNode);
		},
		// 设备选择设备选择
		onCheckedEquipments(equipments) {
			this.equipments = equipments;
			this.$emit("onCheckedEquipments", equipments);
		},
		// 卡口选择
		onCheckedTollgates(tollgates) {
			this.tollgates = tollgates;
			this.$emit("onCheckedTollgates", tollgates);
		},
		// 关闭弹框
		close(data) {
			this.$refs.modal.close();
			this.$emit("close", data);
		},
		//  全部取消选择的设备
		removeAll() {
			this.$refs.resourcesSelect.removeAll();
		},
		// 删除单个
		removeTree(item, k) {
			this.$emit("remove", item, k);
		},
		// 赋值
		checkNodes(ids) {
			this.$refs.resourcesSelect.checkNodes(ids);
		},
		// 刷新
		refresh() {
			this.$refs.resourcesSelect.refresh();
		},
		//保存
		save(data) {
			this.$emit("save", data);
		}
	}
};
</script>
<style lang="less">
</style>
