import type { Preview } from "@storybook/react";
import React from 'react';

import '../src/styles/main.scss';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="argo-theme">
        <Story />
      </div>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
