module.exports = {
  module: {
    rules: [
      {
        test: /\.glsl$/,
        use: [
          {
            loader: "raw-loader",
          },
        ],
      },
    ],
  },
};
