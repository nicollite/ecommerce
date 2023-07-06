const { default: tsJest } = require("ts-jest");
const { default: jestPresetAngular } = require("jest-preset-angular");

module.exports = fixIstanbulDecoratorCoverageTransformer();

function fixIstanbulDecoratorCoverageTransformer() {
  const transformer = jestPresetAngular.createTransformer();
  const process = transformer.process.bind(transformer);
  transformer.process = (...args) => {
    let result = process(...args).code;
    console.log({ result });
    if (!result) return;
    if (result.code) result = result.code;
    // Ignore decorators on methods and properties
    result = result.replace(/__decorate/g, "/* istanbul ignore next */__decorate");

    // When constructor parameters have decorated properties (eg @inject), TS adds
    // a typeof branch check, which we don't want to instrument
    result = result.replace(
      /(?<=__metadata\("design:paramtypes".*?)(typeof \(_\w\s*=)/g,
      "/* istanbul ignore next */$1",
    );

    return { code: result };
  };

  return transformer;
}
