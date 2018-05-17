const path = require("path");
const webpack = require("webpack");

const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin; // Hot reloading and inline style replacement

module.exports = {
	mode: "development",
	devServer: {
		compress: true,
		contentBase: path.join(__dirname, "public"),
		historyApiFallback: true,
		hot: true,
		inline: true,
		port: 9090,
		watchContentBase: true,
		stats: {
			colors: true,
		},
	},
	plugins: [new HotModuleReplacementPlugin()],
};
