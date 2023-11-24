import DetailsItem from "./detailsItem";

const Details = () => {
    return (
        <div className="details">
          <div className="details__row">
            <DetailsItem />
            <DetailsItem />
          </div>
          <div className="details__row">
            <DetailsItem />
            <DetailsItem />
          </div>
        </div>
    )
}

export default Details;