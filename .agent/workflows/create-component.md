---
description: Create a new UI component
---

1. Create a new file in `src/components/` with a kebab-case name (e.g., `my-component.js`).
2. Define the component class extending `LitElement`.
   - Use `static properties` for reactive state.
   - Use `static styles` for CSS.
   - Implement `render()`.
3. Register the custom element using `customElements.define('my-component', MyComponent)`.
4. Import the new component in `src/components/app-root.js` (or the relevant parent component) to make it available.
