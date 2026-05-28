import clsx from 'clsx';

import { cva } from 'class-variance-authority';
import { ReactNode } from 'react';
import { ConnectingCellProvider, useConnectingCellContext } from './context';

type ConnectionType = 'none' | 'connected';
export interface ConnectingCellProps {
  bottom: ConnectionType;
  top: ConnectionType;
  right: ConnectionType;
  children: ReactNode;
}

const $connectingCell = cva(
  'min-w-[var(--speakeasy-expandable-cell-size)] min-h-6',
  {
    variants: {
      connection: {
        connected: '',
        none: '',
      },
      side: {
        top: '',
        bottom: '',
        right: '',
        left: '',
      },
    },
    compoundVariants: [
      {
        connection: 'connected',
        side: 'top',
        class: 'border-r border-border',
      },
      {
        connection: 'connected',
        side: 'bottom',
        class: 'border-r border-border',
      },
      {
        connection: 'connected',
        side: 'right',
        class: 'border-b border-border',
      },
      {
        connection: 'connected',
        side: 'left',
        class: 'border-l border-border',
      },
    ],
  }
);

export function ConnectingCell({
  bottom: bottomConnection,
  top: topConnection,
  right: rightConnection,
  children
}: ConnectingCellProps) {
  if (Array.isArray(children) && !children.length) {
    return children;
  }

  const isConnected =
    bottomConnection != 'none' ||
    topConnection != 'none' ||
    rightConnection != 'none';

  return (
    <ConnectingCellProvider>
      <div
        data-slot="connecting-cell"
        data-bottom-connection={bottomConnection}
        data-top-connection={topConnection}
        data-right-connection={rightConnection}
        className="group flex flex-row group/connecting-cell"
      >
        {/* Upper left cell, responsible for the top connection */}

        {isConnected ? (
          <div
            className="grid grid-cols-[auto_auto] shrink-0 grid-rows-[auto_1fr]"
            data-type="connecting-cell"
          >
            {/* Upper left cell, responsible for the top connection */}
            <div
              data-type="connecting-cell-top"
              className={clsx(
                $connectingCell({
                  connection: topConnection,
                  side: 'top',
                }),
                topConnection === 'connected' &&
                  $connectingCell({
                    connection: topConnection,
                    side: 'top',
                  })
              )}
            />
            {/* Upper right cell, responsible for the right connection */}
            <div
              data-type="connecting-cell-right"
              className={clsx(
                $connectingCell({
                  connection: rightConnection,
                  side: 'right',
                }),
                rightConnection === 'connected' &&
                  $connectingCell({
                    connection: rightConnection,
                    side: 'right',
                  })
              )}
            />
            {/* Lower left cell, responsible for the bottom connection */}
            <div
              data-type="connecting-cell-bottom"
              className={clsx(
                $connectingCell({
                  connection: bottomConnection,
                  side: 'bottom',
                })
              )}
            />
            {/* Lower right cell, not responsible for any connections */}
            <div
              data-type="connecting-cell-bottom-right"
              className={$connectingCell({
                connection: 'none',
                side: 'bottom',
              })}
            />
          </div>
        ) : null}

        <div className="flex-1 h-full max-w-full" data-type="connecting-cell-content">
          {children}
        </div>
      </div>
    </ConnectingCellProvider>
  );
}
