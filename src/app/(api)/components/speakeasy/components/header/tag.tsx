import { Heading } from '@/components/layout/heading';
import { useUniqueChild } from '@speakeasy-api/docs-md-react';
import AnimatedStarsBackground from '@/components/layout/footer/animated-stars';
import Lamp from '@/../public/assets/sprites/lamp.png';
import LampLight from '@/../public/assets/sprites/lamp_light.gif';
import CatIdle from '@/../public/assets/sprites/cat_idle.gif';
import OrangeCatIdle from '@/../public/assets/sprites/orange_cat_idle.gif';
import Desk from '@/../public/assets/sprites/desk.png';
import Screen from '@/../public/assets/sprites/animated_screen.gif';
import ScreenLight from '@/../public/assets/sprites/screen_light.gif';
import CatToy from '@/../public/assets/sprites/cat_toy.png';
import Chair from '@/../public/assets/sprites/chair.png';
import WallAssets from '@/../public/assets/sprites/wall_assets.png';
import CatFrame from '@/../public/assets/sprites/cat_frame.png';
import Bookshelf from '@/../public/assets/sprites/bookshelf.png';
import LampLightLarge from '@/../public/assets/sprites/big_light.gif';
import Tree1 from '@/../public/assets/sprites/tree_1.png';
import Tree2 from '@/../public/assets/sprites/tree_2.png';
import TreeBg1 from '@/../public/assets/sprites/tree_bg_1.png';
import TreeBg2 from '@/../public/assets/sprites/tree_bg_2.png';
import Leaves from '@/../public/assets/sprites/leaves.gif';
import Fireflies from '@/../public/assets/sprites/fireflies.gif';
import Grass from '@/../public/assets/sprites/grass_tile.png';
import Rock from '@/../public/assets/sprites/rock.png';

import { SVGProps } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ArrowDownIcon } from '@/components/icons/pixel';
import LightToggle from './toggle';

type TagProps = {
  children: React.ReactNode;
  slot: string;
};
/**
 * This component is a container for a tag. It contains the following sections,
 * if supplied:
 *
 * - Title: assigned to the `title` slot
 * - Description: assigned to the `description` slot
 *
 * Note: At least for the time being, operations are _not_ nested under Tag.
 */
export function Tag({ children, slot }: TagProps) {
  const titleChild = useUniqueChild(children, 'title');
  const descriptionChild = useUniqueChild(children, 'description');

  return (
    <>
      <div slot={slot} className="w-full operation-grid self-stretch h-64">
        <div className="size-full flex items-center relative overflow-hidden">
          <HeaderBackground />

          <Heading className="flex z-10 relative px-api-operation-content">
            {titleChild}
            {descriptionChild}
          </Heading>
        </div>
        <div className="relative api-desktop:flex flex-col items-center justify-center hidden">
          <PlaygroundBackground />

          <div className="not-prose z-10 mt-14 text-secondary-foreground opacity-70 flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <h3 className="text-2xl font-bold">Examples</h3>
              <p className="text-sm">
                Real world code <span className="font-bold">examples</span>
              </p>
            </div>

            <ArrowDownIcon className="size-12" />
          </div>
        </div>
      </div>
    </>
  );
}

function HeaderBackground({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="absolute size-full inset-0 pointer-events-none user-select-none">
      <BackgroundGradient />
      <AnimatedStarsBackground
        density={2000}
        maxOpacity={1.0}
        minOpacity={0.05}
        spawnRate={0.03}
      />
      <div className="absolute size-full inset-0 dark:brightness-40">
        <Image
          quality={100}
          src={TreeBg1}
          alt="Tree BG 1"
          width={1000}
          height={1000}
          className="absolute bottom-7 size-[140px] right-32 -scale-x-[1] dark:brightness-30"
        />

        <Tree
          tree="tree_bg_1"
          withLeaves={false}
          className="right-32 -scale-x-[1] dark:brightness-30"
        />

        <Tree
          tree="tree_bg_2"
          withLeaves={false}
          className="-left-8 dark:brightness-30"
        />

        <Tree tree="tree_1" className="right-16" />

        <Tree tree="tree_2" className="-right-4" />

        <Image
          quality={100}
          src={CatIdle}
          alt="Cat Idle"
          width={1000}
          height={1000}
          className="absolute bottom-7 size-[96px] right-36"
        />

        <Image
          quality={100}
          src={Grass}
          alt="Grass"
          width={1000}
          height={1000}
          className="absolute bottom-7 size-[40px] left-1/2"
        />

        <Image
          quality={100}
          src={Grass}
          alt="Grass"
          width={1000}
          height={1000}
          className="absolute bottom-7 size-[40px] -left-5"
        />

        <Image
          quality={100}
          src={Rock}
          alt="Rock"
          width={1000}
          height={1000}
          className="absolute bottom-7 size-[140px] left-32"
        />
        <Image
          quality={100}
          src={Rock}
          alt="Rock"
          width={1000}
          height={1000}
          className="absolute bottom-7 size-[140px] right-10"
        />

        <Ground />
      </div>

      <Image
        src={Fireflies}
        alt="Fireflies"
        quality={100}
        width={1000}
        height={1000}
        className={
          'hidden dark:block absolute bottom-7 right-32 size-[140px] mix-blend-screen opacity-80'
        }
      />
    </div>
  );
}

export function PlaygroundBackground() {
  return (
    <>
      <PlaygroundGradient />

      <LightToggle />

      <div className="absolute size-full inset-0 pointer-events-none user-select-none">
        <div className="absolute size-full inset-0 dark:brightness-50">
          <Ground
            backgroundImage="url(/assets/sprites/floor_tile.png)"
            backgroundSize="175px 28px"
          />
          <Image
            quality={100}
            src={WallAssets}
            alt="Wall Assets"
            width={400}
            height={400}
            className="absolute right-10 top-10 size-[100px] dark:brightness-50 dark:opacity-20"
          />

          <Image
            quality={100}
            src={CatFrame}
            alt="Cat Frame"
            width={400}
            height={400}
            className="absolute left-10 top-10 size-[100px] dark:brightness-50 dark:opacity-20"
          />

          <Image
            quality={100}
            src={Lamp}
            alt="Lamp"
            width={1000}
            height={1000}
            className="absolute bottom-7 right-6 size-[140px]"
          />

          <Image
            quality={100}
            src={CatToy}
            alt="Cat Toy"
            width={1000}
            height={1000}
            className="absolute bottom-7 right-24 size-[140px]"
          />

          <Image
            quality={100}
            src={Bookshelf}
            alt="Lamp Light"
            width={1000}
            height={1000}
            className="absolute bottom-7 -right-12 size-[140px]"
          />

          <div className="absolute bottom-7 left-0 size-[140px]">
            <Image
              quality={100}
              src={Desk}
              alt="Desk"
              width={1000}
              height={1000}
              className="absolute inset-0 size-[140px] scale-x-[-1]"
            />
            <Image
              quality={100}
              src={Chair}
              alt="Chair"
              width={1000}
              height={1000}
              className="absolute inset-0 ml-8 size-[140px] scale-x-[-1]"
            />
          </div>

          <Image
            quality={100}
            src={OrangeCatIdle}
            alt="Orange Cat Idle"
            width={1000}
            height={1000}
            className="absolute bottom-7 size-[96px] right-1/2 -translate-x-4"
          />
        </div>

        <Image
          quality={100}
          src={LampLight}
          alt="Lamp Light"
          width={1000}
          height={1000}
          className="absolute mix-blend-hard-light dark:mix-blend-overlay dark:opacity-20 bottom-7 right-6 size-[140px]"
        />

        <Image
          quality={100}
          src={Screen}
          alt="Screen"
          width={1000}
          height={1000}
          className="absolute bottom-7 left-0 size-[140px] scale-x-[-1] dark:opacity-60"
        />
        <Image
          quality={100}
          src={ScreenLight}
          alt="Screen Light"
          width={1000}
          height={1000}
          className="absolute bottom-7 left-0 size-[140px] scale-x-[-1] mix-blend-plus-lighter opacity-30 hidden dark:block"
        />

        <Image
          quality={100}
          src={LampLightLarge}
          alt="Lamp Light Large"
          width={1000}
          height={1000}
          className="absolute bottom-7 right-6 size-[140px] mix-blend-overlay hidden dark:block"
        />
      </div>
    </>
  );
}

function BackgroundGradient() {
  const className = 'absolute w-full h-full bottom-0 z-0 cursor-pointer-none';
  return (
    <>
      <LightGradient className={cn(className, 'dark:hidden')} />
      <DarkGradient className={cn(className, 'hidden dark:flex')} />
    </>
  );
}

function PlaygroundGradient() {
  const className =
    'absolute w-full h-full bottom-0 z-0 cursor-pointer-none dark:brightness-40';
  return <NeutralGradient className={cn(className)} />;
}

const LightGradient = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 275"
    preserveAspectRatio="none"
    fill="none"
    {...props}
  >
    <path fill="#F9E092" d="M0 0h10v275H0z" />
    <path fill="#FF9549" d="M1059 92.001H0v23h1059v-23Z" opacity={0.1} />
    <path fill="#FF9549" d="M1059 69H0v23h1059V69Z" opacity={0.2} />
    <path fill="#FF9549" d="M1059 46H0v23h1059V46Z" opacity={0.3} />
    <path fill="#FF9549" d="M1059 23H0v23h1059V23Z" opacity={0.6} />
    <path fill="#FF9549" d="M1059 0H0v23h1059V0Z" opacity={0.8} />
  </svg>
);

const NeutralGradient = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 275"
    preserveAspectRatio="none"
    fill="none"
    {...props}
  >
    <path fill="#E8E6DA" d="M0 0h10v275H0z" />
    <path fill="#D9D7CB" d="M581 92.155H0v23h581z" opacity={0.1} />
    <path fill="#D9D7CB" d="M581 69.155H0v23h581z" opacity={0.2} />
    <path fill="#D9D7CB" d="M581 46.155H0v23h581z" opacity={0.3} />
    <path fill="#D9D7CB" d="M581 23.155H0v23h581z" opacity={0.6} />
    <path fill="#D9D7CB" d="M581 .155H0v23h581z" opacity={0.8} />
  </svg>
);

const DarkGradient = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={56}
    height={983}
    viewBox="0 0 56 983"
    preserveAspectRatio="none"
    fill="none"
    {...props}
  >
    <path fill="#000" d="M0 240h56v743H0z" />
    <g fill="#303990" opacity={0.4}>
      <path d="M56 839.003H0v-48h56z" opacity={0.6} />
      <path d="M56 647H0v-48h56z" opacity={0.2} />
      <path d="M56 599H0v-48h56z" opacity={0.1} />
      <path d="M56 887.003H0v-48h56z" opacity={0.7} />
      <path d="M56 695.001H0v-48h56z" opacity={0.3} />
      <path d="M56 935.004H0v-48h56z" opacity={0.75} />
      <path d="M56 743.001H0v-48h56z" opacity={0.4} />
      <path d="M56 983.004H0v-48h56z" opacity={0.8} />
      <path d="M56 791.002H0v-48h56z" opacity={0.5} />
    </g>
    <path fill="#000" d="M56 48H0V0h56z" opacity={0.1} />
    <path fill="#000" d="m56 96-56 .001v-48h56z" opacity={0.2} />
    <path fill="#000" d="M56 144.001H0v-48h56z" opacity={0.3} />
    <path fill="#000" d="M56 192.002H0v-48h56z" opacity={0.6} />
    <path fill="#000" d="M56 240.002H0v-48h56z" opacity={0.8} />
  </svg>
);

const Ground = ({
  className,
  backgroundImage = 'url(/assets/sprites/ground_tile.png)',
  backgroundSize = 'var(--bg-size) var(--bg-size)',
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  backgroundImage?: string;
  backgroundSize?: string;
}) => {
  return (
    <div
      data-footer-ground
      className={cn(
        'w-full h-7 [--bg-size:28px] absolute bottom-0 z-0',
        className
      )}
      style={
        {
          animationPlayState: 'paused',
          backgroundImage,
          backgroundRepeat: 'repeat-x',
          backgroundSize,
          backgroundPosition: '0 bottom',
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

const TREE_OPTIONS = [
  {
    src: Tree1,
    name: 'tree_1',
    leavesClassName: 'right-8 bottom-8 rotate-12',
  },
  {
    src: Tree2,
    name: 'tree_2',
    leavesClassName: 'size-[120px] top-6',
  },
  {
    src: TreeBg1,
    name: 'tree_bg_1',
  },
  {
    src: TreeBg2,
    name: 'tree_bg_2',
  },
];

const Tree = ({
  className,
  tree,
  withLeaves = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  tree: (typeof TREE_OPTIONS)[number]['name'];
  withLeaves?: boolean;
}) => {
  const selectedTree = TREE_OPTIONS.find(t => t.name === tree);

  if (!selectedTree) {
    return null;
  }

  return (
    <div className={cn('absolute bottom-7 size-[140px]', className)} {...props}>
      <Image
        src={selectedTree.src}
        alt="Tree"
        width={1000}
        height={1000}
        className={'absolute inset-0 size-full'}
      />
      {withLeaves && (
        <Image
          src={Leaves}
          alt="Leaves"
          quality={100}
          width={1000}
          height={1000}
          className={cn(
            'dark:hidden absolute size-full',
            selectedTree.leavesClassName
          )}
        />
      )}
    </div>
  );
};

/**
 * This component is a container for a tag title. It is assigned to the `title`
 * slot of Tag.
 */
export function TagTitle({ children, slot }: TagProps) {
  return <>{children}</>;
}

/**
 * This component is a container for a tag description. It is assigned to the
 * `description` slot of Tag.
 */
export function TagDescription({ children, slot }: TagProps) {
  return (
    <div className="max-w-sm text-balance text-sm text-secondary-foreground/80">
      {children}
    </div>
  );
}
