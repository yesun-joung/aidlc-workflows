import { render, screen } from '@testing-library/preact';
import { ReviewArticlePriceSection } from './index';

const { mockMapMarketplacePrice, mockGetMarketplaceHref } = vi.hoisted(() => ({
	mockMapMarketplacePrice: vi.fn(),
	mockGetMarketplaceHref: vi.fn(() => '/marketplace/honda/cr-v'),
}));

vi.mock('@autos/utils/map-marketplace-price', () => ({
	mapMarketplacePrice: (...args) => mockMapMarketplacePrice(...args),
}));

vi.mock('@caranddriver/page-utils/price-utils', () => ({
	getFormattedPriceRange: vi.fn(() => '$32,000–$38,000'),
}));

vi.mock('@hdm/utils/currency', () => ({
	formatCurrency: vi.fn((amount) => `$${amount.toLocaleString('en-US')}`),
}));

vi.mock('@autos/components/marketplace/marketplace-cta', () => ({
	default: ({ href, children, ...props }) => (
		<a href={href} data-testid="marketplace-cta" {...props}>
			{children}
		</a>
	),
}));

vi.mock('@caranddriver/components/marketplace/trade-in-cta', () => ({
	default: () => null,
}));

vi.mock('@autos/components/marketplace/marketplace-cta/utils', () => ({
	getMarketplaceReviewArticle: vi.fn(() => ({})),
	useDisplayMarketplaceCTA: vi.fn(() => true),
	getMarketplaceHref: (...args) => mockGetMarketplaceHref(...args),
	getMarketplaceHrefNew: vi.fn(() => '/shop/new'),
	getMarketplaceHrefUsed: vi.fn(() => '/shop/used'),
	getMarketplaceHrefUsedNoYear: vi.fn(() => '/shop/used-all'),
	getMarketplaceHrefCertifiedNoYear: vi.fn(() => '/shop/certified'),
}));

vi.mock('@caranddriver/components/marketplace/trade-in-cta/utils', () => ({
	useIsValidMarketStatusForTradeIn: vi.fn(() => true),
}));

vi.mock('@hdm/components/skip-link', () => ({
	SkipLink: ({ children }) => children,
}));

vi.mock('@media-platforms/flagger', () => ({
	useFlag: vi.fn(() => false),
}));

vi.mock('./styles', () => ({
	PriceSectionContainer: ({ children }) => <div>{children}</div>,
	PriceTitleContainer: ({ children }) => (
		<div data-testid={`${String(children).toLowerCase()}-title`}>{children}</div>
	),
	PriceButtonsContainer: ({ children }) => <div>{children}</div>,
	PriceValues: ({ children }) => <span data-testid="price-values">{children}</span>,
	CarValueForecastLink: ({ children }) => <button type="button">{children}</button>,
	ValueForecastIcon: () => null,
	HeroPriceCtasWrapper: ({ children }) => <div data-testid="shop-ctas">{children}</div>,
}));

const basePrice = { low: 32000, high: 38000, is_estimate: false };
const msrpCopy = '$32,000–$38,000';
const marketplaceCopy = 'Marketplace  $30,000 - $35,000';

describe('<ReviewArticlePriceSection />', () => {
	beforeEach(() => {
		mockMapMarketplacePrice.mockReturnValue({ hide: false, display: msrpCopy });
		mockGetMarketplaceHref.mockClear();
	});

	it('renders an empty price slot while inFlight', () => {
		mockMapMarketplacePrice.mockReturnValue({ hide: true, display: null });

		render(
			<ReviewArticlePriceSection
				price={basePrice}
				vehicleModelId="vm-1"
				marketStatus="used"
				inFlight
				marketplaceLow={30000}
				marketplaceHigh={35000}
			/>,
		);

		expect(screen.queryByTestId('marketplace-title')).toBeNull();
		expect(screen.queryByTestId('msrp-title')).toBeNull();
		expect(screen.queryByTestId('price-values')).toBeNull();
		expect(screen.queryByTestId('marketplace-cta')).toBeNull();
		expect(screen.getByTestId('shop-ctas')).toBeTruthy();
	});

	it('shows Marketplace title and price body like MSRP when market status is used', () => {
		mockMapMarketplacePrice.mockReturnValue({ hide: false, display: marketplaceCopy });

		render(
			<ReviewArticlePriceSection
				price={basePrice}
				vehicleModelId="vm-1"
				marketStatus="used"
				marketplaceLow={30000}
				marketplaceHigh={35000}
			/>,
		);

		expect(mockMapMarketplacePrice).toHaveBeenCalledWith(
			expect.objectContaining({ low: 30000, high: 35000 }),
		);
		expect(screen.getByTestId('marketplace-title')).toHaveTextContent('Marketplace');
		expect(screen.queryByTestId('msrp-title')).toBeNull();
		expect(screen.getByTestId('marketplace-cta')).toHaveTextContent('$30,000 - $35,000');
	});

	it('falls back to MSRP when market status is not used', () => {
		render(
			<ReviewArticlePriceSection
				price={basePrice}
				vehicleModelId="vm-1"
				marketStatus="new"
				marketplaceLow={30000}
				marketplaceHigh={35000}
			/>,
		);

		expect(mockMapMarketplacePrice).toHaveBeenCalledWith(
			expect.objectContaining({ low: undefined, high: undefined }),
		);
		expect(screen.getByTestId('msrp-title')).toHaveTextContent('MSRP');
		expect(screen.queryByTestId('marketplace-title')).toBeNull();
		expect(screen.getByTestId('price-values')).toHaveTextContent(msrpCopy);
	});

	it('shows MSRP title and body on MSRP fallback', () => {
		render(
			<ReviewArticlePriceSection
				price={basePrice}
				vehicleModelId="vm-1"
				marketStatus="used"
			/>,
		);

		expect(screen.getByTestId('msrp-title')).toHaveTextContent('MSRP');
		expect(screen.getByTestId('price-values')).toHaveTextContent(msrpCopy);
	});

	it('falls back to MSRP when readFailed', () => {
		render(
			<ReviewArticlePriceSection
				price={basePrice}
				vehicleModelId="vm-1"
				marketStatus="used"
				readFailed
				marketplaceLow={30000}
				marketplaceHigh={35000}
			/>,
		);

		expect(screen.getByTestId('msrp-title')).toBeTruthy();
		expect(screen.getByTestId('price-values')).toHaveTextContent(msrpCopy);
		expect(screen.queryByText(/error/i)).toBeNull();
	});

	it('passes marketplace href to MarketplaceCta for used marketplace copy', () => {
		mockMapMarketplacePrice.mockReturnValue({ hide: false, display: marketplaceCopy });

		render(
			<ReviewArticlePriceSection
				price={basePrice}
				vehicleModelId="vm-1"
				marketStatus="used"
				marketplace={{ cox: { slug: 'honda-cr-v' } }}
				marketplaceLow={30000}
				marketplaceHigh={35000}
			/>,
		);

		expect(mockGetMarketplaceHref).toHaveBeenCalled();
		expect(screen.getByTestId('marketplace-cta')).toHaveAttribute(
			'href',
			'/marketplace/honda/cr-v',
		);
	});

	it('falls back to MSRP without calling mapper when vehicleModelId is absent', () => {
		render(<ReviewArticlePriceSection price={basePrice} marketStatus="used" />);

		expect(mockMapMarketplacePrice).not.toHaveBeenCalled();
		expect(screen.getByTestId('msrp-title')).toHaveTextContent('MSRP');
		expect(screen.getByTestId('price-values')).toHaveTextContent(msrpCopy);
	});

	it('renders no price text when mapper returns hide with null display', () => {
		mockMapMarketplacePrice.mockReturnValue({ hide: true, display: null });

		render(
			<ReviewArticlePriceSection price={basePrice} vehicleModelId="vm-1" marketStatus="used" />,
		);

		expect(screen.queryByTestId('price-values')).toBeNull();
		expect(screen.queryByTestId('marketplace-cta')).toBeNull();
	});
});
