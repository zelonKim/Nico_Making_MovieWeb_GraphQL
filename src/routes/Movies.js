import { gql, useQuery } from "@apollo/client"
import { Link } from "react-router-dom"

const ALL_MOVIES = gql`
     query getMovies {
        allMovies {
            id
            title
            medium_cover_image
        }
    }
`

export default function Movies() {
    const { data, loading, error } = useQuery(ALL_MOVIES)

    if(loading) {
        return <h1>Loading...</h1>
    }
    if(error) {
        return <h1>Error...</h1>
    }
    return (
        <ul> 
            <h1>Movies</h1>
            {data.allMovies.map(movie => 
            <li key={movie.id}>
                <Link to={`/movies/${movie.id}`}>
                    <img src={movie.medium_cover_image}></img>
                </Link>
            </li>
    )} </ul>
    )
}
