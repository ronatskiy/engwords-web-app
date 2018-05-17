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
			filename: "[name].[hash].min.js",
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
			...(isDevMode ? developmentConfig.plugins : productionConfig.plugins),
			new MiniCssExtractPlugin({
				filename: `[name].${isDevMode ? "" : "[contenthash]"}.css`,
				chunkFilename: `[id].${isDevMode ? "" : "[contenthash]"}.css`,
				publicPath: "../",
			}),
			new HtmlWebpackPlugin({
				template: "./public/index.html",
				minify: true,
				inject: "body",
			}),
		],
	};
};
