const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9001,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/static/images", to: "images"},
                {from: "./node_modules/admin-lte/plugins/fontawesome-free/webfonts", to: "webfonts"},
                {from: "./node_modules/admin-lte/plugins/fontawesome-free/css/all.min.css", to: "css"},
                {from: "./node_modules/admin-lte/dist/css/adminlte.min.css", to: "css"},
                {from: "./node_modules/admin-lte/dist/js/adminlte.min.js", to: "js"},
                {from: "./node_modules/admin-lte/plugins/jquery/jquery.min.js", to: "js"},
                {from: "./node_modules/admin-lte/plugins/bootstrap/js/bootstrap.bundle.min.js", to: "js"},
                {from: "./node_modules/admin-lte/plugins/chart.js/Chart.min.js", to: "js"},
                {from: "./node_modules/admin-lte/plugins/chart.js/Chart.min.css", to: "css"},
                {from: "./node_modules/admin-lte/plugins/datatables/jquery.dataTables.min.js", to: "js"},
                {from: "./node_modules/admin-lte/plugins/datatables-responsive/js/dataTables.responsive.min.js", to: "js"},
                {from: "./node_modules/admin-lte/plugins/datatables-responsive/js/responsive.bootstrap4.min.js", to: "js"},
                {from: "./node_modules/admin-lte/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css", to: "css"},
                {from: "./node_modules/admin-lte/plugins/datatables-responsive/css/responsive.bootstrap4.min.css", to: "css"},
                {from: "./node_modules/admin-lte/plugins/select2/js/select2.full.min.js", to: "js"},
                {from: "./node_modules/admin-lte/plugins/select2/css/select2.min.css", to: "css"},
                {from: "./node_modules/admin-lte/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css", to: "css"},
                {from: "./node_modules/admin-lte/plugins/moment/moment.min.js", to: "js"},
                {from: "./node_modules/admin-lte/plugins/moment/locale/ru.js", to: "js/moment-ru-locale.js"},
                {from: "./node_modules/admin-lte/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js", to: "js"},
                {from: "./node_modules/admin-lte/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css", to: "css"},
            ],
        })
    ]
};