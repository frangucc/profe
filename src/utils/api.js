const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  constructor() {
    this.baseURL = `${API_URL}/api`;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.clearToken();
  }

  // Survey endpoints
  async getSurveyQuestions() {
    return this.request('/survey/questions');
  }

  async submitSurvey(responses) {
    return this.request('/survey/submit', {
      method: 'POST',
      body: JSON.stringify({ responses }),
    });
  }

  // User endpoints
  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getDashboardStats() {
    return this.request('/users/dashboard/stats');
  }

  async getAllUsers() {
    return this.request('/users');
  }

  // Course endpoints
  async getCourses(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/courses?${params}`);
  }

  async getCourse(id) {
    return this.request(`/courses/${id}`);
  }

  async enrollInCourse(id) {
    return this.request(`/courses/${id}/enroll`, {
      method: 'POST',
    });
  }

  async createCourse(courseData) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }
}

export default new ApiClient();
