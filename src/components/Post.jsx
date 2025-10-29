import { useState } from 'react';

function Post({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="bg-white border border-neutral-200 rounded-lg shadow-sm mb-6 hover:shadow-md transition-shadow">
      {/* Header del Post */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
            {post.author.avatar}
          </div>
          <div>
            <p className="font-semibold text-sm text-neutral-800">{post.author.name}</p>
            {post.author.businessType && (
              <p className="text-xs text-neutral-500">{post.author.businessType}</p>
            )}
            {post.author.category && (
              <p className="text-xs text-primary-600 font-medium">{post.author.category}</p>
            )}
          </div>
        </div>
        <button className="p-2 hover:bg-neutral-100 rounded-full text-neutral-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Imagen del Post */}
      <div className="relative bg-gray-200 aspect-square">
        <img
          src={post.image}
          alt={post.description}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Acciones */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLiked(!liked)}
              className="flex items-center gap-1 hover:opacity-70 transition-opacity"
            >
              <svg
                className={`w-6 h-6 ${liked ? 'fill-primary-500 stroke-primary-500' : 'fill-none stroke-neutral-600'}`}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span className={`text-sm ${liked ? 'text-primary-600 font-semibold' : 'text-neutral-600'}`}>
                Recomendar
              </span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 hover:opacity-70 transition-opacity"
            >
              <svg className="w-6 h-6 stroke-neutral-600" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm text-neutral-600">Comentar</span>
            </button>
            <button className="flex items-center gap-1 hover:opacity-70 transition-opacity">
              <svg className="w-6 h-6 stroke-neutral-600" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="text-sm text-neutral-600">Compartir</span>
            </button>
          </div>
          <button
            onClick={() => setSaved(!saved)}
            className="hover:opacity-70 transition-opacity"
          >
            <svg
              className={`w-6 h-6 ${saved ? 'fill-primary-600 stroke-primary-600' : 'fill-none stroke-neutral-600'}`}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Likes */}
        <p className="text-sm text-neutral-700 mb-2">
          <span className="font-semibold">{post.likes}</span> recomendaciones
        </p>

        {/* Descripción */}
        <div className="text-sm mb-2 text-neutral-800">
          <span className="font-semibold mr-2">{post.author.name}</span>
          <span>{post.description}</span>
        </div>

        {/* Ver comentarios */}
        {post.comments > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-neutral-600 hover:text-neutral-800 mb-2 font-medium"
          >
            Ver los {post.comments} comentarios
          </button>
        )}

        {/* Tiempo */}
        <p className="text-xs text-neutral-500">{post.timeAgo}</p>
      </div>

      {/* Agregar comentario */}
      <div className="border-t border-neutral-200 p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-xs">
          U
        </div>
        <input
          type="text"
          placeholder="Escribe un comentario..."
          className="flex-1 outline-none text-sm border-none focus:ring-0 text-neutral-800 placeholder-neutral-400"
        />
        <button className="text-primary-600 font-semibold text-sm hover:text-primary-700">
          Comentar
        </button>
      </div>
    </article>
  );
}

export default Post;
