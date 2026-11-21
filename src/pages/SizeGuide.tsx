import { Link } from 'react-router-dom';
import { BackBar, Screen, TitleHead } from '../components/Chrome';
import { IconArrow, IconSparkle } from '../components/Icons';

export default function SizeGuide() {
  return (
    <Screen>
      <BackBar title="Size guide" />
      <TitleHead title="Find your fit." eyebrow="Measured in centimetres" />

      <div className="stack" style={{ marginTop: 18 }}>
        <p style={{ fontSize: 11.5, lineHeight: 1.75, color: '#6f6356', margin: 0 }}>
          Our pieces are cut true to size. Measure against your body — not over clothing — and keep
          the tape level and snug. If you sit between two sizes, take the larger.
        </p>

        <div className="eyebrow" style={{ marginTop: 26 }}>
          Clothing
        </div>
        <table className="sizetable">
          <thead>
            <tr>
              <th>Size</th>
              <th>Bust</th>
              <th>Waist</th>
              <th>Hip</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>XS</td>
              <td>80–84</td>
              <td>62–66</td>
              <td>88–92</td>
            </tr>
            <tr>
              <td>S</td>
              <td>84–88</td>
              <td>66–70</td>
              <td>92–96</td>
            </tr>
            <tr>
              <td>M</td>
              <td>88–92</td>
              <td>70–74</td>
              <td>96–100</td>
            </tr>
            <tr>
              <td>L</td>
              <td>92–98</td>
              <td>74–80</td>
              <td>100–106</td>
            </tr>
            <tr>
              <td>XL</td>
              <td>98–104</td>
              <td>80–86</td>
              <td>106–112</td>
            </tr>
          </tbody>
        </table>

        <div className="eyebrow" style={{ marginTop: 26 }}>
          Shoes
        </div>
        <table className="sizetable">
          <thead>
            <tr>
              <th>EU</th>
              <th>UK</th>
              <th>US</th>
              <th>Foot length</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['36', '3', '5.5', '22.5'],
              ['37', '4', '6.5', '23.2'],
              ['38', '5', '7.5', '23.9'],
              ['39', '6', '8.5', '24.6'],
              ['40', '7', '9.5', '25.3'],
              ['41', '8', '10.5', '26.0'],
            ].map(([eu, uk, us, cm]) => (
              <tr key={eu}>
                <td>{eu}</td>
                <td>{uk}</td>
                <td>{us}</td>
                <td>{cm} cm</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="eyebrow" style={{ marginTop: 26 }}>
          How to measure
        </div>
        <div className="info" style={{ padding: 0 }}>
          <h2 style={{ marginTop: 12 }}>Bust</h2>
          <p>Measure around the fullest part of the bust, keeping the tape level under the arms.</p>
          <h2>Waist</h2>
          <p>Measure the narrowest part of your waist, usually just above the navel.</p>
          <h2>Hip</h2>
          <p>Stand with feet together and measure around the fullest part of the hips.</p>
        </div>

        <Link className="btn btn--ghost" to="/contact" style={{ marginTop: 8 }}>
          <span>Ask for sizing advice</span>
          <IconSparkle size={16} />
        </Link>
        <Link className="link-arrow" to="/shop" style={{ justifyContent: 'center', marginTop: 18 }}>
          Back to the wardrobe <IconArrow size={13} />
        </Link>
      </div>
      <div style={{ height: 24 }} />
    </Screen>
  );
}
