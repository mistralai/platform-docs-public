import Admonition from './admonition';

export function CommunityPlugin({ children }: { children?: React.ReactNode }) {
  return (
    <Admonition type="warning" title="Community plugin" hideType>
      <p>
        This plugin is developed and maintained by the community. It is not part of the{' '}
        <code>mistralai-search-toolkit</code> package and is not covered by Mistral AI
        support. It can change independently of Search Toolkit releases. Install it
        separately and refer to its repository for configuration, usage, and support.
      </p>
      {children}
    </Admonition>
  );
}

export default CommunityPlugin;
