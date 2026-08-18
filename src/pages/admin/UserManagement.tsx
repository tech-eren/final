import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';
import { Search, Filter, MoreVertical, Edit, Ban, CheckCircle } from 'lucide-react';
import type { User } from '../../types';

// Mock users for the prototype
const MOCK_USERS: User[] = [
  { id: 'usr_1', name: 'Alice Freeman', email: 'alice.f@example.com', role: 'CITIZEN', createdAt: '2023-01-15T10:30:00Z' },
  { id: 'usr_2', name: 'Bob Smith', email: 'bob.smith@citygov.org', role: 'AUTHORITY', createdAt: '2022-11-05T08:15:00Z' },
  { id: 'usr_3', name: 'Admin User', email: 'admin@citygov.org', role: 'ADMIN', createdAt: '2021-08-20T14:00:00Z' },
  { id: 'usr_4', name: 'Charlie Davis', email: 'charlie.d@example.com', role: 'CITIZEN', createdAt: '2023-06-10T09:45:00Z' },
  { id: 'usr_5', name: 'Diana Prince', email: 'diana.p@citygov.org', role: 'AUTHORITY', createdAt: '2023-02-28T11:20:00Z' },
];

export function UserManagement() {
  const [users] = useState<User[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useToast();

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDisableUser = (userId: string) => {
    console.log(userId);
    addToast({ title: 'User account has been disabled (Mock Action)', type: 'success' });
  };

  const handleEditRole = (userId: string) => {
    console.log(userId);
    addToast({ title: 'Role update dialog opened (Mock Action)', type: 'info' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-sm text-slate-500">Manage platform users, roles, and access permissions.</p>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-200 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                label=""
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">Add User</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Joined Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-slate-500 text-xs">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'AUTHORITY' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-green-600 text-xs font-medium">
                        <CheckCircle className="w-3 h-3 mr-1" /> Active
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEditRole(user.id)}
                          className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
                          title="Edit Role"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDisableUser(user.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          title="Disable Account"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No users found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
