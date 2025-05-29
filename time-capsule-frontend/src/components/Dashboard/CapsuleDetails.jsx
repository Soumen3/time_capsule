import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import capsuleService from '../../services/capsule'; // Adjust path as needed
import MainLayout from '../Layout/MainLayout'; // Adjust path as needed
import Button from '../Button'; // Adjust path as needed

const CapsuleDetailsPage = () => {
  const { capsuleId } = useParams();
  const navigate = useNavigate();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCapsuleDetails = async () => {
      if (!capsuleId) return;
      setLoading(true);
      setError('');
      try {
        const data = await capsuleService.getCapsuleById(capsuleId);
        setCapsule(data);
      } catch (err) {
        setError(err.message || 'Failed to load capsule details.');
        console.error("Failed to fetch capsule details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsuleDetails();
  }, [capsuleId]);

  if (loading) {
    return <MainLayout><div className="text-center py-10">Loading capsule details...</div></MainLayout>;
  }

  if (error) {
    return <MainLayout><div className="text-center py-10 text-red-500">Error: {error}</div></MainLayout>;
  }

  if (!capsule) {
    return <MainLayout><div className="text-center py-10">Capsule not found.</div></MainLayout>;
  }

  const formattedDate = capsule.delivery_date
    ? new Date(capsule.delivery_date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : 'Not scheduled';
  
  const formattedTime = capsule.delivery_time || "N/A";

  // Function to get the filename from a URL
  const getFilenameFromUrl = (url) => {
    if (!url) return 'file';
    try {
      const path = new URL(url).pathname;
      return path.substring(path.lastIndexOf('/') + 1);
    } catch (e) {
      // If it's a relative path or not a valid URL, try basic split
      const parts = url.split('/');
      return parts[parts.length - 1] || 'file';
    }
  };


  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <Button onClick={() => navigate(-1)} variant="outline" className="mb-6">&larr; Back to Dashboard</Button>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{capsule.title}</h2>
        <p className="text-gray-600 mb-6">{capsule.description || "No description provided."}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-1">Delivery Date:</h3>
            <p className="text-gray-600">{formattedDate}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-1">Delivery Time:</h3>
            <p className="text-gray-600">{formattedTime}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-1">Privacy:</h3>
            <p className="text-gray-600">{capsule.privacy_status || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-1">Recipient:</h3>
            <p className="text-gray-600">{capsule.recipients?.[0]?.recipient_email || 'N/A'}</p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Contents:</h3>
        {capsule.contents && capsule.contents.length > 0 ? (
          <ul className="space-y-6">
            {capsule.contents.map(content => (
              <li key={content.id} className="p-4 border rounded-lg bg-gray-50 shadow">
                <p className="font-semibold capitalize text-lg text-gray-700 mb-2">{content.content_type}</p>
                {content.content_type === 'text' && (
                  <p className="text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border">
                    {content.text_content}
                  </p>
                )}
                {content.file && (
                  <div className="mt-2">
                    {content.content_type === 'image' && (
                      <img 
                        src={content.file} 
                        alt={getFilenameFromUrl(content.file)} 
                        className="max-w-full h-auto rounded-md border shadow-sm" 
                      />
                    )}
                    {content.content_type === 'video' && (
                      <video 
                        src={content.file} 
                        controls 
                        className="max-w-full rounded-md border shadow-sm"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {content.content_type === 'audio' && (
                      <audio 
                        src={content.file} 
                        controls 
                        className="w-full"
                      >
                        Your browser does not support the audio tag.
                      </audio>
                    )}
                    {/* Link for non-previewable types or as a general download option */}
                    {(content.content_type === 'document' || !['image', 'video', 'audio', 'text'].includes(content.content_type)) && (
                      <a 
                        href={content.file}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium inline-flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
                        View/Download {getFilenameFromUrl(content.file)}
                      </a>
                    )}
                  </div>
                )}
                {!content.text_content && !content.file && (
                  <p className="text-gray-500 italic">No content preview available for this item.</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No contents in this capsule.</p>
        )}

        {/* Add actions like Edit, Delete, Share based on capsule status and ownership */}
        <div className="mt-8 flex justify-end space-x-3">
            {/* Example: <Button variant="secondary">Edit Capsule</Button> */}
        </div>
      </div>
    </MainLayout>
  );
};

export default CapsuleDetailsPage;
