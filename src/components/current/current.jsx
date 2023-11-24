const Current = (props) => {
    return (
        <div className="current">
            <div className="current__city"> {props.city} </div>
            <div className="current__description"> {props.description} </div>
            <div className="current__temperature"> {props.temperature}˚ </div>
        </div>
    )
}

export default Current;