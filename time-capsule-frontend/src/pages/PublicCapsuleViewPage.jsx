import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import capsuleService from '../services/capsule';
import MainLayout from '../components/Layout/MainLayout'; // Or a simpler public layout

const PublicCapsuleViewPage = () => {
  const { accessToken } = useParams();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Helper for image loading state, specific to this page
  const ImageRenderer = ({ src, alt }) => {
    const [imgLoading, setImgLoading] = useState(true);
    const [imgError, setImgError] = useState(false);

    return (
      <div className="relative min-h-[200px] flex items-center justify-center bg-gray-100 rounded-lg shadow-md">
        {imgLoading && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        {imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 p-4 text-center">
            <p className="font-semibold">Could not load image.</p>
            <p className="text-xs truncate max-w-full">{alt}</p>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={`max-w-full h-auto rounded-lg shadow-md inline-block transition-opacity duration-500 ${imgLoading || imgError ? 'opacity-0' : 'opacity-100'}`}
          style={{ maxHeight: '500px', display: imgError ? 'none' : 'inline-block' }}
          onLoad={() => {
            setImgLoading(false);
            setImgError(false);
          }}
          onError={() => {
            setImgLoading(false);
            setImgError(true);
          }}
        />
      </div>
    );
  };

  useEffect(() => {
    const fetchCapsule = async () => {
      if (!accessToken) {
        setError('No access token provided.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError('');
        const data = await capsuleService.getPublicCapsuleByToken(accessToken);
        setCapsule(data);
        console.log('Public Capsule Data:', data);
      } catch (err) {
        setError(err.message || 'Could not load the time capsule. The link might be invalid or expired.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsule();
  }, [accessToken]);

  const renderContentItem = (item) => {
    const mediaUrl = item.file ? `${import.meta.env.VITE_API_BASE_URL}${item.file.substring(1)}` : null;
    // ^ Adjust VITE_API_BASE_URL if it includes /api/ already, or construct full URL properly.
    // Assuming item.file is like "/media/capsule_files/image.jpg"
    // and VITE_API_BASE_URL is "http://localhost:8000"
    // then mediaUrl should be "http://localhost:8000/media/capsule_files/image.jpg"
    // If VITE_API_BASE_URL is "http://localhost:8000/api/", then need to adjust.
    // For simplicity, let's assume VITE_API_BASE_URL is just the domain.
    // A better way is to ensure your backend serves media correctly and item.file is a full URL or relative to MEDIA_URL.
    // For now, let's assume item.file is a relative path from MEDIA_ROOT.
    // The backend serializer should ideally return full URLs for files.

    // Let's assume the backend serializer for PublicCapsuleContentSerializer returns full URLs for `file`
    // If not, you'll need to construct it:
    // const fullMediaUrl = item.file ? `${import.meta.env.VITE_API_DOMAIN || 'http://localhost:8000'}${item.file}` : null;

    const getCleanFilename = (url) => {
      if (!url) return 'Unnamed Document';
      try {
        // Create a URL object. This works even if the URL has query params.
        const urlObject = new URL(url);
        // Get the pathname (e.g., /media/capsule_files/700-review-1785.pdf)
        const pathname = urlObject.pathname;
        // Get the last part of the pathname
        return pathname.substring(pathname.lastIndexOf('/') + 1);
      } catch (e) {
        // Fallback for invalid URLs or if it's just a simple string
        const parts = url.split('/').pop();
        return parts.split('?')[0]; // Attempt to remove query string as a fallback
      }
    };


    switch (item.content_type) {
      case 'text':
        return (
          <div className="p-4 mb-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-2">Message:</h4>
            <p className="text-gray-600 whitespace-pre-wrap">{item.text_content}</p>
          </div>
        );
      case 'image':
        return (
          <div className="mb-4 text-center">
            <ImageRenderer src={item.file_url} alt={getCleanFilename(item.file) || 'Capsule image'} />
          </div>
        );
      case 'video':
        return (
          <div className="mb-4">
            <video controls src={item.file_url} className="w-full rounded-lg shadow-md" style={{ maxHeight: '500px' }}>
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'audio':
        return (
          <div className="mb-4">
            <audio controls src={item.file_url} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case 'document':
        return (
          <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-md shadow-sm">
            <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium underline">
              View Document: {getCleanFilename(item.file)}
            </a>
            <p className="text-sm text-gray-500 mt-1">Click to open the document in a new tab.</p>
          </div>
        );
      default:
        return <p className="text-gray-500">Unsupported content type.</p>;
    }
  };


  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <p className="text-xl text-gray-700">Loading your Time Capsule...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-10 px-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
          <p className="text-lg text-gray-700 mb-6">{error}</p>
          <Link to="/" className="text-blue-600 hover:underline">Go to Homepage</Link>
        </div>
      </MainLayout>
    );
  }

  if (!capsule) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <p className="text-xl text-gray-700">Capsule not found.</p>
        </div>
      </MainLayout>
    );
  }
  
  const deliveryDate = new Date(capsule.delivery_date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
          <header className="mb-8 text-center border-b pb-6 border-gray-200">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{capsule.title}</h1>
            <p className="text-lg text-gray-600">A message from {capsule.owner_name || 'a friend'}, unsealed on {deliveryDate}.</p>
          </header>

          {capsule.description && (
            <section className="mb-8 p-4 bg-indigo-50 rounded-md border border-indigo-100">
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">About this Capsule:</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{capsule.description}</p>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Capsule Contents</h2>
            {capsule.contents && capsule.contents.length > 0 ? (
              capsule.contents.sort((a, b) => a.order - b.order).map(item => (
                <div key={item.id} className="mb-6">
                  {renderContentItem(item)}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">This capsule appears to be empty.</p>
            )}
          </section>
          
          <footer className="mt-10 text-center pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Time Capsule Project. All rights reserved.</p>
             <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">Create your own Time Capsule</Link>
          </footer>
        </div>
      </div>
    </MainLayout>
  );
};

export default PublicCapsuleViewPage;
