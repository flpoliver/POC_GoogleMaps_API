const commutesPerYear = 260 * 2;
const litresPerKM = 10 / 100;
const gasLitreCost = 1.5;
const litreCostKM = litresPerKM * gasLitreCost;
const secondsPerDay = 60 * 60 * 24;

type DistanceProps = {
  leg: google.maps.DirectionsLeg;
};

export default function Distance({ leg }: DistanceProps) {
  if (!leg.distance || !leg.duration) return null;

  const days = Math.floor(
    (commutesPerYear * leg.duration.value) / secondsPerDay
  );
  const cost = Math.floor(
    (leg.distance.value / 1000) * litreCostKM * commutesPerYear
  );

  return (
    <div>
      <p>
        <span>
          Essa viatura está{" "}
          <span className="highlight">{leg.distance.text}</span> de distância da
          residência
        </span>
        <br />
        <span>
          Chegará em torno de{" "}
          <span className="highlight">{leg.duration.text}</span>
        </span>
        <br />
        <span>
          Entrar em contato: <span className="highlight">11 98888-8888</span>
        </span>
      </p>
    </div>
  );
}
