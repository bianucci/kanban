import { startComponents } from "@gondel/core";
import { hot } from "@gondel/plugin-hot";
declare const module: any;
hot(module);

// Load components
// import "./components/atoms/button/button";
// import "./components/atoms/input/input";

// Load all components
const componentsContext = (require as any).context(
  "./components",
  true,
  /\.ts$/
);
componentsContext.keys().forEach(componentsContext);

startComponents();
