const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: {
        main: path.resolve(__dirname, "./src/index.js"),
    },

    devServer: {
        static: "./dist",
    },
    
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].bundle.js",
        assetModuleFilename: "[name][ext]",
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: "asset/resource",
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: "Game",
            template: path.resolve(__dirname, "./src/template.html"), // template file
            filename: "index.html", // output file
        }),
        new CleanWebpackPlugin(),
        new ESLintPlugin()
    ],
};