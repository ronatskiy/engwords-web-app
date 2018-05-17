const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
	mode: "production",
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true,
				uglifyOptions: {
					mangle: {
						reserved: ["$super", "$", "exports", "require", "angular"],
					},
				},
			}),
			new OptimizeCSSAssetsPlugin({}),
		],
	},
	plugins: [
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, "public"),
			},
		]),
	],
};
