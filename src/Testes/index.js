import supabase from "../servers/SupabaseConect";
import { useState, useEffect } from "react"
import './style.css';

// Componente
import PubliCards from "../componets/Cards";

const ListImages = () => {
  const [fetchError, setFetchError] = useState(null)
  const [publis, setPublis] = useState(null)

  useEffect(() => {
    const fetchPubli = async () => {
      const { data, error } = await supabase
        .from('countries')
        .select()

      if (error) {
        setFetchError('Sem nada para mostrar')
        setPublis(null)
        console.log(error)
      }

      if (data) {
        setPublis(data)
        setFetchError(null)
      }
    }

    fetchPubli()

    const channel = supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'countries' },
        (payload) => {
          console.log('Change received!', payload)
          fetchPubli(); // Atualiza os dados quando houver alteração
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };

  }, [])

  return (
    <div className="page home">
      {fetchError && (<p>{fetchError}</p>)}
      {publis && (
        <div className="grid-container"> {/* Adicione a classe grid-container aqui */}
          {publis.map(publi => (
            <PubliCards key={publi.id} publi={publi}/>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListImages;
