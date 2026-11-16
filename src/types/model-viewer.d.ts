import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'ios-src'?: string;
          alt?: string;
          poster?: string;
          loading?: 'auto' | 'lazy' | 'eager';
          reveal?: 'auto' | 'manual';
          ar?: boolean;
          'ar-modes'?: string;
          'ar-scale'?: 'auto' | 'fixed';
          'ar-placement'?: 'floor' | 'wall';
          'camera-controls'?: boolean;
          'disable-zoom'?: boolean;
          'disable-pan'?: boolean;
          'disable-tap'?: boolean;
          'touch-action'?: string;
          'auto-rotate'?: boolean;
          'auto-rotate-delay'?: string | number;
          'rotation-per-second'?: string;
          'interaction-prompt'?: 'auto' | 'when-focused' | 'none';
          'camera-orbit'?: string;
          'field-of-view'?: string;
          'min-camera-orbit'?: string;
          'max-camera-orbit'?: string;
          'min-field-of-view'?: string;
          'max-field-of-view'?: string;
          'shadow-intensity'?: string | number;
          'shadow-softness'?: string | number;
          exposure?: string | number;
          environment_image?: string;
          'skybox-image'?: string;
          seamless_poster?: boolean;
          autoplay?: boolean;
          'animation-name'?: string;
          slot?: string;
        },
        HTMLElement
      >;
    }
  }

  namespace React.JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'ios-src'?: string;
          alt?: string;
          poster?: string;
          loading?: 'auto' | 'lazy' | 'eager';
          reveal?: 'auto' | 'manual';
          ar?: boolean;
          'ar-modes'?: string;
          'ar-scale'?: 'auto' | 'fixed';
          'ar-placement'?: 'floor' | 'wall';
          'camera-controls'?: boolean;
          'disable-zoom'?: boolean;
          'disable-pan'?: boolean;
          'disable-tap'?: boolean;
          'touch-action'?: string;
          'auto-rotate'?: boolean;
          'auto-rotate-delay'?: string | number;
          'rotation-per-second'?: string;
          'interaction-prompt'?: 'auto' | 'when-focused' | 'none';
          'camera-orbit'?: string;
          'field-of-view'?: string;
          'min-camera-orbit'?: string;
          'max-camera-orbit'?: string;
          'min-field-of-view'?: string;
          'max-field-of-view'?: string;
          'shadow-intensity'?: string | number;
          'shadow-softness'?: string | number;
          exposure?: string | number;
          environment_image?: string;
          'skybox-image'?: string;
          seamless_poster?: boolean;
          autoplay?: boolean;
          'animation-name'?: string;
          slot?: string;
        },
        HTMLElement
      >;
    }
  }
}
