"use client";

import { useState } from "react";
import { Plus, X, Edit2, Check, Clock, DollarSign, User, Phone, Mail, Calendar, MessageSquare } from "lucide-react";
import { leads as defaultLeads, workTypes as defaultWorkTypes } from "../../database";

interface WorkType {
  id: string;
  name: string;
}

interface Lead {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  description: string;
  budget: string;
  status: 'lead' | 'work' | 'completed';
  createdAt: string;
  followups: Followup[];
}

interface Followup {
  id: string;
  date: string;
  note: string;
}

export default function Freelance() {
  const [workTypes, setWorkTypes] = useState<WorkType[]>(defaultWorkTypes);
  const [activeTab, setActiveTab] = useState<string>('1');
  const [showWorkTypeModal, setShowWorkTypeModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [newWorkType, setNewWorkType] = useState('');
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  
  const [leads, setLeads] = useState<Lead[]>(defaultLeads as Lead[]);

  const [newLead, setNewLead] = useState({
    clientName: '',
    email: '',
    phone: '',
    description: '',
    budget: ''
  });

  const [newFollowup, setNewFollowup] = useState({
    date: '',
    note: ''
  });

  const addWorkType = () => {
    if (newWorkType.trim()) {
      const newType = {
        id: Date.now().toString(),
        name: newWorkType
      };
      setWorkTypes([...workTypes, newType]);
      setNewWorkType('');
      setShowWorkTypeModal(false);
    }
  };

  const addLead = () => {
    if (newLead.clientName && newLead.email) {
      const lead: Lead = {
        id: Date.now().toString(),
        ...newLead,
        status: 'lead',
        createdAt: new Date().toISOString().split('T')[0],
        followups: []
      };
      setLeads([...leads, lead]);
      setNewLead({ clientName: '', email: '', phone: '', description: '', budget: '' });
      setShowLeadModal(false);
    }
  };

  const addFollowup = () => {
    if (selectedLead && newFollowup.date && newFollowup.note) {
      setLeads(leads.map(lead => {
        if (lead.id === selectedLead) {
          return {
            ...lead,
            followups: [...lead.followups, {
              id: Date.now().toString(),
              ...newFollowup
            }]
          };
        }
        return lead;
      }));
      setNewFollowup({ date: '', note: '' });
      setShowFollowupModal(false);
      setSelectedLead(null);
    }
  };

  const updateLeadStatus = (leadId: string, status: 'lead' | 'work' | 'completed') => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status } : lead
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-blue-100 text-blue-700';
      case 'work': return 'bg-orange-100 text-orange-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredLeads = leads.filter(lead => lead.id); // In real app, filter by work type

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
    
      {/* Work Type Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {workTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`px-5 py-2 rounded-lg whitespace-nowrap text-base transition-all font-semibold ${
                activeTab === type.id
                  ? 'bg-gray-900 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.name}
            </button>
          ))}
          <button
            onClick={() => setShowWorkTypeModal(true)}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2 border border-dashed border-gray-400"
          >
            <Plus size={18} />
            Add Type
          </button>
        </div>
      </div>
    
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg"><User className="text-blue-600" size={22} /></div>
          <div>
            <p className="text-sm text-gray-600 mb-0.5">Total Leads</p>
            <p className="text-xl font-bold text-gray-900">{filteredLeads.filter(l => l.status === 'lead').length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-lg"><Clock className="text-orange-600" size={22} /></div>
          <div>
            <p className="text-sm text-gray-600 mb-0.5">In Progress</p>
            <p className="text-xl font-bold text-gray-900">{filteredLeads.filter(l => l.status === 'work').length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg"><Check className="text-green-600" size={22} /></div>
          <div>
            <p className="text-sm text-gray-600 mb-0.5">Completed</p>
            <p className="text-xl font-bold text-gray-900">{filteredLeads.filter(l => l.status === 'completed').length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg"><DollarSign className="text-purple-600" size={22} /></div>
          <div>
            <p className="text-sm text-gray-600 mb-0.5">Total Value</p>
            <p className="text-xl font-bold text-gray-900">$13,000</p>
          </div>
        </div>
      </div>
    
      {/* Add Lead Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowLeadModal(true)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold shadow transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Lead
        </button>
      </div>
    
      {/* Leads List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-900">Leads & Projects</h2></div>
        <div className="divide-y divide-gray-100">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-base">{lead.clientName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>{lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1"><Mail size={14} />{lead.email}</span>
                    <span className="flex items-center gap-1"><Phone size={14} />{lead.phone}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} />{lead.createdAt}</span>
                    <span className="flex items-center gap-1"><DollarSign size={14} />{lead.budget}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{lead.description}</p>
    
                  {/* Followups */}
                  {lead.followups.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-600 mb-2">Follow-ups ({lead.followups.length})</p>
                      <div className="space-y-2">
                        {lead.followups.map((followup) => (
                          <div key={followup.id} className="flex items-start gap-2 text-xs">
                            <MessageSquare size={12} className="text-gray-400 mt-0.5" />
                            <div>
                              <span className="text-gray-500">{followup.date}:</span>
                              <span className="text-gray-700 ml-1">{followup.note}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
    
              {/* Action Buttons */}
              <div className="flex gap-2 mt-2">
                {lead.status === 'lead' && (
                  <button
                    onClick={() => updateLeadStatus(lead.id, 'work')}
                    className="px-3 py-1.5 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 shadow-sm transition-all"
                  >
                    Convert to Work
                  </button>
                )}
                {lead.status === 'work' && (
                  <button
                    onClick={() => updateLeadStatus(lead.id, 'completed')}
                    className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 shadow-sm transition-all"
                  >
                    Mark Completed
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedLead(lead.id);
                    setShowFollowupModal(true);
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 shadow-sm transition-all"
                >
                  Add Follow-up
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    
      {/* Modals: enhance only modal background */}
      {showWorkTypeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Work Type</h3>
              <button onClick={() => setShowWorkTypeModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              value={newWorkType}
              onChange={(e) => setNewWorkType(e.target.value)}
              placeholder="Enter work type (e.g., Poster Design)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={addWorkType}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowWorkTypeModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Lead</h3>
              <button onClick={() => setShowLeadModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={newLead.clientName}
                onChange={(e) => setNewLead({...newLead, clientName: e.target.value})}
                placeholder="Client Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="email"
                value={newLead.email}
                onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="tel"
                value={newLead.phone}
                onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                placeholder="Phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                value={newLead.budget}
                onChange={(e) => setNewLead({...newLead, budget: e.target.value})}
                placeholder="Budget (e.g., $5000)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                value={newLead.description}
                onChange={(e) => setNewLead({...newLead, description: e.target.value})}
                placeholder="Project Description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24 resize-none"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={addLead}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add Lead
              </button>
              <button
                onClick={() => setShowLeadModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Followup Modal */}
      {showFollowupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Follow-up</h3>
              <button onClick={() => setShowFollowupModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="date"
                value={newFollowup.date}
                onChange={(e) => setNewFollowup({...newFollowup, date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                value={newFollowup.note}
                onChange={(e) => setNewFollowup({...newFollowup, note: e.target.value})}
                placeholder="Follow-up notes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24 resize-none"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={addFollowup}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add Follow-up
              </button>
              <button
                onClick={() => setShowFollowupModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}