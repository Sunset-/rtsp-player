export default (window.$checker = {
	isPort(val, tip) {
		if (Sunset.isNumber(val) && String(val).indexOf(".") == -1) {
			val = +val;
			if (val > 0 && val <= 65535) {
				return true;
			}
		}
		if (tip) {
			$tip(tip);
		}
		return false;
	},
	isIpPort(val,tip) {
		val = val + "";
		var ipport = val.split(":");
		if (ipport.length == 2) {
			if (
				/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/.test(
					ipport[0]
				) &&
				(Sunset.isNumber(ipport[1]) && +ipport[1] > 0 && +ipport[1] <= 65535)
			) {
				return true;
			}
		}
		if (tip) {
			$tip(tip);
		}
		return false;
	}
});
