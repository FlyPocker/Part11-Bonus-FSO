const ListElement = ({ person, btnHandler }) => (
    <li>
        {person.name}: {person.number}
        <button onClick={btnHandler}>delete</button>
    </li>
)

const List = ({ list, btnHandler }) => {
    return(
    <ul>
        {list.map(number => <ListElement key={number.name} person={number} btnHandler={() => btnHandler(number.id)}/>)}
    </ul>
)}

export default List