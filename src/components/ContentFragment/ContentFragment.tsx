/**
 * Content Fragment Component
 * Renders AEM Content Fragments with field mapping
 */

import React, { useEffect, useState } from 'react';
import { AEMComponentProps, ContentFragment as CFType } from '../../core/types';
import { MapTo } from '../../core/MapTo';
import { resolveCFReference } from '../../core/ContentFragmentResolver';
import './ContentFragment.css';

export interface ContentFragmentProps extends AEMComponentProps {
  fragmentPath?: string;
  fragmentData?: CFType;
  renderField?: (name: string, value: any) => React.ReactNode;
  className?: string;
}

const ContentFragmentComponent: React.FC<ContentFragmentProps> = ({
  fragmentPath,
  fragmentData,
  renderField,
  className = '',
  isInEditor,
  ...rest
}) => {
  const [fragment, setFragment] = useState<CFType | null>(fragmentData || null);
  const [loading, setLoading] = useState(!fragmentData && !!fragmentPath);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (fragmentPath && !fragmentData) {
      setLoading(true);
      resolveCFReference(fragmentPath)
        .then((cf) => {
          setFragment(cf);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }, [fragmentPath, fragmentData]);

  if (loading) {
    return (
      <div className={`aem-cf aem-cf--loading ${className}`} {...rest}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    if (isInEditor) {
      return (
        <div className={`aem-cf aem-cf--error ${className}`} {...rest}>
          <div style={{ padding: '1rem', color: 'red', border: '1px solid red' }}>
            Error loading Content Fragment: {error.message}
          </div>
        </div>
      );
    }
    return null;
  }

  if (!fragment) {
    if (isInEditor) {
      return (
        <div className={`aem-cf aem-cf--empty ${className}`} {...rest}>
          <p>No Content Fragment selected</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={`aem-cf ${className}`} data-cf-path={fragmentPath} {...rest}>
      {fragment.title && <h3 className="aem-cf__title">{fragment.title}</h3>}

      {fragment.description && (
        <p className="aem-cf__description">{fragment.description}</p>
      )}

      {fragment.elements && (
        <div className="aem-cf__fields">
          {Object.entries(fragment.elements).map(([name, field]) => (
            <div key={name} className="aem-cf__field">
              <div className="aem-cf__field-name">{name}</div>
              <div className="aem-cf__field-value">
                {renderField ? renderField(name, field.value) : field.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ContentFragmentComponent.displayName = 'ContentFragment';

export const ContentFragment = MapTo('aem-react-toolkit/components/contentfragment')(
  ContentFragmentComponent
);

export default ContentFragment;
