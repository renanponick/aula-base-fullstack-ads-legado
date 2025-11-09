import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const token = localStorage.getItem('token');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Carregar usuários ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/api/v1/user`, axiosConfig);
      setUsers(response.data.data || response.data || []);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentUser(null);
    setFormData({ name: '', email: '', password: '' });
    setShowModal(true);
  };

  const handleOpenEditModal = (user) => {
    setModalMode('edit');
    setCurrentUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
    });
    setShowModal(true);
  };

  const handleOpenViewModal = (user) => {
    setModalMode('view');
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser(null);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/user`,
        formData,
        axiosConfig
      );
      setSuccess('Usuário criado com sucesso!');
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar usuário');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      await axios.put(
        `${API_URL}/api/v1/user/${currentUser.id}`,
        updateData,
        axiosConfig
      );
      setSuccess('Usuário atualizado com sucesso!');
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar usuário');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      setError('');
      setSuccess('');

      try {
        await axios.delete(
          `${API_URL}/api/v1/user/${userId}`,
          axiosConfig
        );
        setSuccess('Usuário deletado com sucesso!');
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao deletar usuário');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Gerenciamento de Usuários</h1>
        <button className="btn btn-danger" onClick={onLogout}>
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="users-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Usuários</h2>
          <button className="btn btn-primary btn-small" onClick={handleOpenCreateModal}>
            + Novo Usuário
          </button>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum usuário encontrado</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => handleOpenViewModal(user)}
                      >
                        Ver
                      </button>
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => handleOpenEditModal(user)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {modalMode === 'view' && currentUser && (
              <>
                <h2>Detalhes do Usuário</h2>
                <div className="user-detail">
                  <label>ID:</label>
                  <p>{currentUser.id}</p>
                </div>
                <div className="user-detail">
                  <label>Nome:</label>
                  <p>{currentUser.name}</p>
                </div>
                <div className="user-detail">
                  <label>Email:</label>
                  <p>{currentUser.email}</p>
                </div>
                <div className="modal-buttons">
                  <button className="btn btn-secondary" onClick={handleCloseModal}>
                    Fechar
                  </button>
                </div>
              </>
            )}

            {modalMode === 'create' && (
              <>
                <h2>Criar Novo Usuário</h2>
                <form onSubmit={handleCreateUser}>
                  <div className="form-group">
                    <label htmlFor="name">Nome:</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Senha:</label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="modal-buttons">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Criar
                    </button>
                  </div>
                </form>
              </>
            )}

            {modalMode === 'edit' && currentUser && (
              <>
                <h2>Editar Usuário</h2>
                <form onSubmit={handleUpdateUser}>
                  <div className="form-group">
                    <label htmlFor="name">Nome:</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Senha (deixe em branco para não alterar):</label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="modal-buttons">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Salvar
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
