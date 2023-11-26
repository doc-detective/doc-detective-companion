import App from './App.js';

// This default export determines where your story goes in the story list.
export default {
  title: 'Doc Detective Companion/App',
  component: App,
  decorators: [
    (Story) => (
      <div style={{ width: '350px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
    // args at the component level for all stories.
  args: {
  }
};

export const Default = {}