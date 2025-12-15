"use client";

import { useState } from "react";
import { Plus, X, Eye, Clock, DollarSign, User, Phone, Mail, Calendar, MessageSquare, ChevronDown, ChevronUp, Globe, Key, Server, CreditCard, CheckCircle2, Edit2, AlertCircle } from "lucide-react";

interface WorkType {
  id: string;
  name: string;
}

interface Followup {
  id: string;
  date: string;
  note: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  description: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface ProjectDetails {
  projectValue: string;
  domainName: string;
  domainLogin: string;
  domainPassword: string;
  hostingProvider: string;
  hostingLogin: string;
  hostingPassword: string;
  notes: string;
}

interface Transaction {
  id: string;
  date: string;
  type: 'domain' | 'hosting' | 'payment' | 'expense';
  description: string;
  amount: string;
  status: 'pending' | 'completed';
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
  appointments: Appointment[];
  projectDetails?: ProjectDetails;
  transactions: Transaction[];
}

export default function Freelance() {
  const [workTypes] = useState<WorkType[]>([
    { id: '1', name: 'Web Development' },
    { id: '2', name: 'Graphic Design' }
  ]);
  
  const [activeTab, setActiveTab] = useState<string>('1');
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      clientName: 'John Smith',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      description: 'Need a modern e-commerce website',
      budget: '$5000',
      status: 'lead',
      createdAt: '2024-11-15',
      followups: [
        { id: '1', date: '2024-11-16', note: 'Initial discussion about requirements' }
      ],
      appointments: [],
      transactions: []
    }
  ]);

  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showFollowupsModal, setShowFollowupsModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const [newLead, setNewLead] = useState({
    clientName: '', email: '', phone: '', description: '', budget: ''
  });

  const [newFollowup, setNewFollowup] = useState({ date: '', note: '' });
  
  const [newAppointment, setNewAppointment] = useState({
    date: '', time: '', description: ''
  });

  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    projectValue: '', domainName: '', domainLogin: '', domainPassword: '',
    hostingProvider: '', hostingLogin: '', hostingPassword: '', notes: ''
  });

  const [newTransaction, setNewTransaction] = useState({
    date: '', type: 'domain' as const, description: '', amount: ''
  });

  const addLead = () => {
    if (newLead.clientName && newLead.email) {
      const lead: Lead = {
        id: Date.now().toString(),
        ...newLead,
        status: 'lead',
        createdAt: new Date().toISOString().split('T')[0],
        followups: [],
        appointments: [],
        transactions: []
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
            followups: [...lead.followups, { id: Date.now().toString(), ...newFollowup }]
          };
        }
        return lead;
      }));
      setNewFollowup({ date: '', note: '' });
      setShowFollowupModal(false);
    }
  };

  const addAppointment = () => {
    if (selectedLead && newAppointment.date && newAppointment.time) {
      setLeads(leads.map(lead => {
        if (lead.id === selectedLead) {
          return {
            ...lead,
            appointments: [...lead.appointments, {
              id: Date.now().toString(),
              ...newAppointment,
              status: 'scheduled' as const
            }]
          };
        }
        return lead;
      }));
      setNewAppointment({ date: '', time: '', description: '' });
      setShowAppointmentModal(false);
    }
  };

  const saveProjectDetails = () => {
    if (selectedLead) {
      setLeads(leads.map(lead => {
        if (lead.id === selectedLead) {
          return { ...lead, projectDetails };
        }
        return lead;
      }));
      setShowProjectDetailsModal(false);
    }
  };

  const addTransaction = () => {
    if (selectedLead && newTransaction.date && newTransaction.amount) {
      setLeads(leads.map(lead => {
        if (lead.id === selectedLead) {
          return {
            ...lead,
            transactions: [...lead.transactions, {
              id: Date.now().toString(),
              ...newTransaction,
              status: 'completed' as const
            }]
          };
        }
        return lead;
      }));
      setNewTransaction({ date: '', type: 'domain', description: '', amount: '' });
      setShowTransactionModal(false);
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

  const getCurrentLead = () => leads.find(l => l.id === selectedLead);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Work Type Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {workTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`px-5 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                activeTab === type.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Leads</p>
              <p className="text-2xl font-bold text-gray-800">{leads.filter(l => l.status === 'lead').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-800">{leads.filter(l => l.status === 'work').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{leads.filter(l => l.status === 'completed').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-800">$13,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Lead Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowLeadModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Lead
        </button>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Lead Header */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{lead.clientName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-2"><Mail size={14} />{lead.email}</span>
                    <span className="flex items-center gap-2"><Phone size={14} />{lead.phone}</span>
                    <span className="flex items-center gap-2"><Calendar size={14} />{lead.createdAt}</span>
                    <span className="flex items-center gap-2"><DollarSign size={14} />{lead.budget}</span>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  {expandedLead === lead.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              <p className="text-sm text-gray-700">{lead.description}</p>
            </div>

            {/* Quick Stats */}
            <div className="px-5 py-3 bg-gray-50 grid grid-cols-3 gap-4 text-center border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Follow-ups</p>
                <p className="text-lg font-semibold text-gray-800">{lead.followups.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Appointments</p>
                <p className="text-lg font-semibold text-gray-800">{lead.appointments.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Transactions</p>
                <p className="text-lg font-semibold text-gray-800">{lead.transactions.length}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedLead(lead.id);
                  setShowFollowupModal(true);
                }}
                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center gap-1"
              >
                <MessageSquare size={14} />
                Add Follow-up
              </button>

              {lead.followups.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedLead(lead.id);
                    setShowFollowupsModal(true);
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1"
                >
                  <Eye size={14} />
                  View All Follow-ups
                </button>
              )}

              {lead.status === 'lead' && (
                <button
                  onClick={() => updateLeadStatus(lead.id, 'work')}
                  className="px-3 py-1.5 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 flex items-center gap-1"
                >
                  <Clock size={14} />
                  Convert to Work
                </button>
              )}

              {lead.status === 'work' && (
                <>
                  <button
                    onClick={() => {
                      setSelectedLead(lead.id);
                      setShowAppointmentModal(true);
                    }}
                    className="px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 flex items-center gap-1"
                  >
                    <Calendar size={14} />
                    Add Appointment
                  </button>
                  <button
                    onClick={() => updateLeadStatus(lead.id, 'completed')}
                    className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center gap-1"
                  >
                    <CheckCircle2 size={14} />
                    Mark Completed
                  </button>
                </>
              )}

              {lead.status === 'completed' && (
                <>
                  <button
                    onClick={() => {
                      setSelectedLead(lead.id);
                      if (lead.projectDetails) setProjectDetails(lead.projectDetails);
                      setShowProjectDetailsModal(true);
                    }}
                    className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 flex items-center gap-1"
                  >
                    <Globe size={14} />
                    {lead.projectDetails ? 'Edit' : 'Add'} Project Details
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLead(lead.id);
                      setShowTransactionModal(true);
                    }}
                    className="px-3 py-1.5 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 flex items-center gap-1"
                  >
                    <CreditCard size={14} />
                    Add Transaction
                  </button>
                </>
              )}
            </div>

            {/* Expanded Details */}
            {expandedLead === lead.id && (
              <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50">
                {/* Appointments */}
                {lead.appointments.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Appointments
                    </h4>
                    <div className="space-y-2">
                      {lead.appointments.map(apt => (
                        <div key={apt.id} className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{apt.date} at {apt.time}</p>
                              <p className="text-xs text-gray-600">{apt.description}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                              apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {apt.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Details */}
                {lead.projectDetails && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Globe size={16} />
                      Project Details
                    </h4>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Project Value:</span>
                        <span className="font-medium text-gray-800">{lead.projectDetails.projectValue}</span>
                        <span className="text-gray-600">Domain:</span>
                        <span className="font-medium text-gray-800">{lead.projectDetails.domainName}</span>
                        <span className="text-gray-600">Hosting:</span>
                        <span className="font-medium text-gray-800">{lead.projectDetails.hostingProvider}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Transactions */}
                {lead.transactions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <CreditCard size={16} />
                      Transactions
                    </h4>
                    <div className="space-y-2">
                      {lead.transactions.map(tx => (
                        <div key={tx.id} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                            <p className="text-xs text-gray-600">{tx.date} • {tx.type}</p>
                          </div>
                          <span className="font-semibold text-gray-800">{tx.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Lead Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New Lead</h3>
              <button onClick={() => setShowLeadModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <input type="text" value={newLead.clientName} onChange={(e) => setNewLead({...newLead, clientName: e.target.value})} placeholder="Client Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <input type="email" value={newLead.email} onChange={(e) => setNewLead({...newLead, email: e.target.value})} placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <input type="tel" value={newLead.phone} onChange={(e) => setNewLead({...newLead, phone: e.target.value})} placeholder="Phone" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <input type="text" value={newLead.budget} onChange={(e) => setNewLead({...newLead, budget: e.target.value})} placeholder="Budget (e.g., $5000)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <textarea value={newLead.description} onChange={(e) => setNewLead({...newLead, description: e.target.value})} placeholder="Project Description" className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addLead} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add Lead</button>
              <button onClick={() => setShowLeadModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* View All Follow-ups Modal */}
      {showFollowupsModal && getCurrentLead() && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">All Follow-ups - {getCurrentLead()?.clientName}</h3>
              <button onClick={() => setShowFollowupsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {getCurrentLead()?.followups.map((followup) => (
                <div key={followup.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <MessageSquare size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 mb-1">{followup.date}</p>
                      <p className="text-sm text-gray-700">{followup.note}</p>
                    </div>
                  </div>
                </div>
              ))}
              {getCurrentLead()?.followups.length === 0 && (
                <p className="text-center text-gray-500 py-8">No follow-ups yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Follow-up Modal */}
      {showFollowupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add Follow-up</h3>
              <button onClick={() => setShowFollowupModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input type="date" value={newFollowup.date} onChange={(e) => setNewFollowup({...newFollowup, date: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <textarea value={newFollowup.note} onChange={(e) => setNewFollowup({...newFollowup, note: e.target.value})} placeholder="Follow-up notes..." className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addFollowup} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add</button>
              <button onClick={() => setShowFollowupModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add Appointment</h3>
              <button onClick={() => setShowAppointmentModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input type="date" value={newAppointment.date} onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <input type="time" value={newAppointment.time} onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <textarea value={newAppointment.description} onChange={(e) => setNewAppointment({...newAppointment, description: e.target.value})} placeholder="Appointment details..." className="w-full px-4 py-2 border border-gray-300 rounded-lg h-20 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addAppointment} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add</button>
              <button onClick={() => setShowAppointmentModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {showProjectDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Project Details</h3>
              <button onClick={() => setShowProjectDetailsModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input type="text" value={projectDetails.projectValue} onChange={(e) => setProjectDetails({...projectDetails, projectValue: e.target.value})} placeholder="Project Value (e.g., $5000)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <input type="text" value={projectDetails.domainName} onChange={(e) => setProjectDetails({...projectDetails, domainName: e.target.value})} placeholder="Domain Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <input type="text" value={projectDetails.domainLogin} onChange={(e) => setProjectDetails({...projectDetails, domainLogin: e.target.value})} placeholder="Domain Login/Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <input type="password" value={projectDetails.domainPassword} onChange={(e) => setProjectDetails({...projectDetails, domainPassword: e.target.value})} placeholder="Domain Password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <input type="text" value={projectDetails.hostingProvider} onChange={(e) => setProjectDetails({...projectDetails, hostingProvider: e.target.value})} placeholder="Hosting Provider (e.g., AWS, Hostinger)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <input type="text" value={projectDetails.hostingLogin} onChange={(e) => setProjectDetails({...projectDetails, hostingLogin: e.target.value})} placeholder="Hosting Login/Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <input type="password" value={projectDetails.hostingPassword} onChange={(e) => setProjectDetails({...projectDetails, hostingPassword: e.target.value})} placeholder="Hosting Password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <textarea value={projectDetails.notes} onChange={(e) => setProjectDetails({...projectDetails, notes: e.target.value})} placeholder="Additional notes..." className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={saveProjectDetails} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Details</button>
              <button onClick={() => setShowProjectDetailsModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add Transaction</h3>
              <button onClick={() => setShowTransactionModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input type="date" value={newTransaction.date} onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <select value={newTransaction.type} onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as any})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="domain">Domain Purchase</option>
                <option value="hosting">Hosting Purchase</option>
                <option value="payment">Client Payment</option>
                <option value="expense">Other Expense</option>
              </select>
              <input type="text" value={newTransaction.description} onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})} placeholder="Description" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <input type="text" value={newTransaction.amount} onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})} placeholder="Amount (e.g., $50)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addTransaction} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add Transaction</button>
              <button onClick={() => setShowTransactionModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}