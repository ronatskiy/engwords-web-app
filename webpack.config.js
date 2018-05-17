const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const productionConfig = require("./webpack.config.prod");
const developmentConfig = require("./webpack.config.dev");

function getBaseConfig(isDevMode) {
	return {
		entry: {
			index: ["babel-polyfill", path.resolve(__dirname, "src/index.js")],
		},

		output: {
			filename: "[name].min.js",
			path: path.resolve(__dirname, "dist"),
			publicPath: "/",
		},

		resolve: {
			descriptionFiles: ["package.json"],
			modules: ["node_modules"],
		},

		devtool: "source-map",

		externals: [/^@angular\//],

		module: {
			rules: [
				{
					test: /\.js$/,
					use: [
						{
							loader: "ng-annotate-loader",
						},
						{
							loader: "babel-loader",
						},
					],
				},
				{
					test: /\.html$/,
					use: [
						{
							loader: "raw-loader",
						},
					],
				},
				{
					test: /\.s?css$/,
					use: [
						isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
						"css-loader",
						"postcss-loader",
						"sass-loader",
					],
				},
				{ test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: "url-loader?limit=100000" },
			],
		},
	};
}

module.exports = function(env, { mode }) {
	const isDevMode = mode !== "production";
	const baseConfig = getBaseConfig(isDevMode);

	return {
		...baseConfig,
		...(isDevMode ? developmentConfig : productionConfig),

		plugins: [
			new MiniCssExtractPlugin({
				filename: isDevMode ? "[name].css" : "[name].[hash].css",
				chunkFilename: isDevMode ? "[id].css" : "[id].[hash].css",
			}),
			new HtmlWebpackPlugin({
				hash: true,
				inject: "body",
				template: "./public/index.html",
			}),
			...(isDevMode ? developmentConfig.plugins : productionConfig.plugins),
		],
	};
};
