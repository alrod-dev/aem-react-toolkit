/**
 * Embed Component
 * Embed external content (YouTube, social media, iframes)
 */

import React, { useMemo } from 'react';
import { AEMComponentProps } from '../../core/types';
import { MapTo } from '../../core/MapTo';
import './Embed.css';

export interface EmbedProps extends AEMComponentProps {
  embedType?: 'youtube' | 'vimeo' | 'twitter' | 'instagram' | 'facebook' | 'iframe' | 'html';
  embedUrl?: string;
  embedCode?: string;
  title?: string;
  className?: string;
}

const EmbedComponent: React.FC<EmbedProps> = ({
  embedType = 'iframe',
  embedUrl,
  embedCode,
  title,
  className = '',
  isInEditor,
  ...rest
}) => {
  const getYoutubeId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const getVimeoId = (url: string): string | null => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  const embedElement = useMemo(() => {
    if (!embedUrl && !embedCode) {
      return null;
    }

    switch (embedType) {
      case 'youtube': {
        const videoId = embedUrl ? getYoutubeId(embedUrl) : null;
        if (!videoId) return null;
        return (
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title || 'YouTube video'}
            allowFullScreen
            loading="lazy"
          />
        );
      }

      case 'vimeo': {
        const videoId = embedUrl ? getVimeoId(embedUrl) : null;
        if (!videoId) return null;
        return (
          <iframe
            width="100%"
            height="400"
            src={`https://player.vimeo.com/video/${videoId}`}
            title={title || 'Vimeo video'}
            allowFullScreen
            loading="lazy"
          />
        );
      }

      case 'twitter':
        return embedCode ? (
          <div dangerouslySetInnerHTML={{ __html: embedCode }} />
        ) : null;

      case 'instagram':
        return embedCode ? (
          <div dangerouslySetInnerHTML={{ __html: embedCode }} />
        ) : null;

      case 'html':
        return embedCode ? (
          <div dangerouslySetInnerHTML={{ __html: embedCode }} />
        ) : null;

      case 'iframe':
      default:
        return embedUrl ? (
          <iframe
            src={embedUrl}
            title={title || 'Embedded content'}
            width="100%"
            height="400"
            loading="lazy"
          />
        ) : null;
    }
  }, [embedType, embedUrl, embedCode, title]);

  if (!embedElement) {
    if (isInEditor) {
      return (
        <div className={`aem-embed aem-embed--empty ${className}`} {...rest}>
          <div className="aem-embed__placeholder">No embed content configured</div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={`aem-embed aem-embed--${embedType} ${className}`} {...rest}>
      <div className="aem-embed__wrapper">{embedElement}</div>
    </div>
  );
};

EmbedComponent.displayName = 'Embed';

export const Embed = MapTo('aem-react-toolkit/components/embed')(EmbedComponent);

export default Embed;
