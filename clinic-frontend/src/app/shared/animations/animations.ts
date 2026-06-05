import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  keyframes,
  state,
} from '@angular/animations';

// Fade in depuis le bas
export const fadeInUp = trigger('fadeInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate(
      '400ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({ opacity: 1, transform: 'translateY(0)' }),
    ),
  ]),
]);

// Fade in simple
export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-out', style({ opacity: 1 })),
  ]),
]);

// Scale in (pour les modals)
export const scaleIn = trigger('scaleIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.95)' }),
    animate(
      '250ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({ opacity: 1, transform: 'scale(1)' }),
    ),
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' })),
  ]),
]);

// Slide in depuis la droite (pour les sidebars/drawers)
export const slideInRight = trigger('slideInRight', [
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate(
      '300ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({ transform: 'translateX(0)', opacity: 1 }),
    ),
  ]),
  transition(':leave', [
    animate(
      '250ms ease-in',
      style({ transform: 'translateX(100%)', opacity: 0 }),
    ),
  ]),
]);

// Slide in depuis le bas (pour les toasts)
export const slideInBottom = trigger('slideInBottom', [
  transition(':enter', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate(
      '300ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({ transform: 'translateY(0)', opacity: 1 }),
    ),
  ]),
  transition(':leave', [
    animate(
      '250ms ease-in',
      style({ transform: 'translateY(20px)', opacity: 0 }),
    ),
  ]),
]);

// Stagger pour les listes
export const listAnimation = trigger('listAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(15px)' }),
        stagger('60ms', [
          animate(
            '350ms cubic-bezier(0.35, 0, 0.25, 1)',
            style({ opacity: 1, transform: 'translateY(0)' }),
          ),
        ]),
      ],
      { optional: true },
    ),
  ]),
]);

// Animation pour les cards stats
export const countUp = trigger('countUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-10px)' }),
    animate(
      '500ms 200ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({ opacity: 1, transform: 'translateY(0)' }),
    ),
  ]),
]);

// Toggle (pour expand/collapse)
export const expandCollapse = trigger('expandCollapse', [
  state('expanded', style({ height: '*', opacity: 1 })),
  state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
  transition('expanded <=> collapsed', [
    animate('300ms cubic-bezier(0.35, 0, 0.25, 1)'),
  ]),
]);

// Overlay backdrop
export const overlayAnimation = trigger('overlay', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
]);
