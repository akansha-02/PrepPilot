import { Navigate } from 'react-router-dom';

export default function StartRedirect() {
  return <Navigate to="/interview/new" replace />;
}