import { render, screen } from '@testing-library/preact';
import VehicleRankingCard from './vehicle-ranking-card';

const { mockMapMarketplacePrice } = vi.hoisted(() => ({
	mockMapMarketplacePrice: vi.fn(),
}));

vi.mock('@autos/utils/map-marketplace-price', () => ({
	mapMarketplacePrice: (...args) => mockMapMarketplacePrice(...args),
}));

vi.mock('@hdm/utils/currency', () => ({
	formatCurrency: vi.fn((amount) => `$${Number(amount).toLocaleString('en-US')}`),
}));

vi.mock('@scope/components/content/utils', () => ({
	getFrontendLink: vi.fn(({ url }) => url),
}));

vi.mock('@caranddriver/layouts/specs/styles', () => ({
	RankHeaderImage: () => null,
}));

vi.mock('@caranddriver/components/accolades/accolades-section', () => ({
	AccoladesSection: () => null,
}));

vi.mock('@caranddriver/components/content/review/vehicle-ranking/utils', () => ({
	useResponsiveContainer: vi.fn(() => ({ isSmallContainer: false })),
	handleCardClick: vi.fn(),
	getAccolades: vi.fn(() => ({})),
	hasAnyAccolade: vi.fn(() => false),
	COMPACT_STYLES: { divider: {}, wrapper: {}, button: {}, image: {} },
}));

vi.mock('@autos/components/marketplace/marketplace-cta', () => ({
	default: ({ buttonText, ...props }) => (
		<button type="button" data-testid="shop-button" {...props}>
			{buttonText}
		</button>
	),
}));

vi.mock('@caranddriver/components/content/review/vehicle-ranking/styles', () => ({
	RankAccoladesWrapper: ({ children }) => children,
	RankHiglightItem: {},
	RankHiglightValue: {},
	RankImageWrapper: ({ children }) => <div>{children}</div>,
	RankInfoWrapper: ({ children }) => <div>{children}</div>,
	RankItem: ({ children, href }) => <a href={href}>{children}</a>,
	RankMake: ({ children }) => <div>{children}</div>,
	RankMakeWrapper: ({ children }) => <div>{children}</div>,
	RankMakeTitle: ({ children }) => <div>{children}</div>,
	RankMakeDivider: () => null,
	RankMakeRating: ({ children }) => <div>{children}</div>,
	RankMakeRatingValue: ({ children }) => <span>{children}</span>,
	RankMakeRatingMax: ({ children }) => <span>{children}</span>,
	RankPrice: ({ children }) => <div data-testid="rank-price">{children}</div>,
	RankValue: ({ children }) => <span>{children}</span>,
}));

const baseProps = {
	highlightItem: false,
	highlightRank: false,
	image: {},
	make: 'Honda',
	model: 'Accord',
	rank: 2,
	slug: '/honda/accord',
	startingAt: 22000,
	price: { low: 22000, high: 24000, marketplace: { low: 18000, high: 21000 } },
	modelId: 'honda_accord',
	marketStatus: 'used',
	marketplace: { cox: { slug: '/shop/honda-accord' } },
};

describe('<VehicleRankingCard />', () => {
	beforeEach(() => {
		mockMapMarketplacePrice.mockReturnValue({
			hide: false,
			display: 'starting at $18,000',
		});
	});

	it('renders an empty price slot while inFlight', () => {
		mockMapMarketplacePrice.mockReturnValue({ hide: true, display: null });

		render(<VehicleRankingCard {...baseProps} inFlight />);

		expect(screen.queryByTestId('rank-price')).toBeNull();
		expect(screen.getByTestId('shop-button')).toBeTruthy();
	});

	it('shows STARTING AT marketplace copy when used and both prices present', () => {
		render(<VehicleRankingCard {...baseProps} />);

		expect(mockMapMarketplacePrice).toHaveBeenCalledWith(
			expect.objectContaining({
				copyVariant: 'starting-at',
				low: 18000,
				high: 21000,
			}),
		);
		expect(screen.getByTestId('rank-price')).toHaveTextContent('STARTING AT: $18,000');
	});

	it('falls back to Original MSRP when market status is not used', () => {
		mockMapMarketplacePrice.mockReturnValue({
			hide: false,
			display: 'STARTING AT: $22,000',
		});

		render(<VehicleRankingCard {...baseProps} marketStatus="new" />);

		expect(mockMapMarketplacePrice).toHaveBeenCalledWith(
			expect.objectContaining({ low: undefined, high: undefined }),
		);
		expect(screen.getByTestId('rank-price')).toHaveTextContent('STARTING AT: $22,000');
	});

	it('falls back to MSRP when readFailed', () => {
		mockMapMarketplacePrice.mockReturnValue({
			hide: false,
			display: 'STARTING AT: $22,000',
		});

		render(<VehicleRankingCard {...baseProps} readFailed />);

		expect(screen.getByTestId('rank-price')).toHaveTextContent('STARTING AT: $22,000');
	});

	it('does not call mapper when modelId is absent', () => {
		render(<VehicleRankingCard {...baseProps} modelId={undefined} />);

		expect(mockMapMarketplacePrice).not.toHaveBeenCalled();
		expect(screen.getByTestId('rank-price')).toHaveTextContent('STARTING AT: $22,000');
	});

	it('keeps the existing Shop button for click-through', () => {
		render(<VehicleRankingCard {...baseProps} />);

		expect(screen.getByTestId('shop-button')).toHaveTextContent('SHOP Accord');
	});
});
