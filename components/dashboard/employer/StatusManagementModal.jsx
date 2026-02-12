"use client";

import { useState, useEffect } from "react";
import {
  FiX,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { statusService } from "@/services/statusService";
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function StatusManagementModal({ isOpen, onClose, onStatusesChange }) {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchStatuses();
    }
  }, [isOpen]);

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const data = await statusService.getStatuses();
      setStatuses(data);
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(statuses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setStatuses(updatedItems);

    // Save new order to backend
    try {
      await statusService.reorderStatuses(
        updatedItems
          .filter(item => !item.isDefault)
          .map(item => ({ id: item._id, order: item.order }))
      );
      if (onStatusesChange) onStatusesChange();
    } catch (error) {
      // Revert on error
      fetchStatuses();
    }
  };

  const handleDeleteStatus = async (statusId) => {
    try {
      await statusService.deleteStatus(statusId);
      setShowDeleteConfirm(null);
      fetchStatuses();
      if (onStatusesChange) onStatusesChange();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        
        <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-lg animate-slideUp">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Manage Statuses</h2>
              <p className="text-sm text-gray-500 mt-1">
                Create, edit, and reorder application statuses
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Add Status Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mb-6"
            >
              <FiPlus className="w-4 h-4" />
              Create New Status
            </button>

            {/* Statuses List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="statuses">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {statuses.map((status, index) => (
                        <Draggable
                          key={status._id || status.key}
                          draggableId={status._id || status.key}
                          index={index}
                          isDragDisabled={status.isDefault}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center justify-between p-4 bg-white border rounded-lg ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''
                              } ${status.isDefault ? 'bg-gray-50' : 'hover:border-blue-300'}`}
                            >
                              <div className="flex items-center gap-4">
                                {!status.isDefault && (
                                  <div className="cursor-move text-gray-400">
                                    ⋮⋮
                                  </div>
                                )}
                                <div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                    {status.name}
                                  </span>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Key: {status.key}
                                  </p>
                                </div>
                                {status.isDefault && (
                                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                    Default
                                  </span>
                                )}
                              </div>

                              {!status.isDefault && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setShowEditModal(status)}
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                  >
                                    <FiEdit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(status)}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      </div>

      {/* Add Status Modal */}
      {showAddModal && (
        <AddStatusModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchStatuses();
            if (onStatusesChange) onStatusesChange();
          }}
        />
      )}

      {/* Edit Status Modal */}
      {showEditModal && (
        <EditStatusModal
          status={showEditModal}
          onClose={() => setShowEditModal(null)}
          onSuccess={() => {
            fetchStatuses();
            if (onStatusesChange) onStatusesChange();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          status={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
          onConfirm={() => handleDeleteStatus(showDeleteConfirm._id)}
        />
      )}
    </>
  );
}

// Add Status Modal
function AddStatusModal({ onClose, onSuccess }) {
  const [statusName, setStatusName] = useState("");
  const [selectedColor, setSelectedColor] = useState(statusService.statusColors[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!statusName.trim()) {
      setError("Status name is required");
      return;
    }

    setLoading(true);
    try {
      await statusService.createStatus({
        name: statusName.trim(),
        color: selectedColor.value,
      });
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create New Status</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Name
            </label>
            <input
              type="text"
              value={statusName}
              onChange={(e) => {
                setStatusName(e.target.value);
                setError("");
              }}
              placeholder="e.g., Phone Screening"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {statusService.statusColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`p-2 rounded-lg border-2 transition ${
                    selectedColor.name === color.name
                      ? 'border-blue-600 ring-2 ring-blue-200'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-8 rounded ${color.value.split(' ')[0]}`} />
                  <span className="text-xs text-gray-600 mt-1 block text-center">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Status'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Status Modal
function EditStatusModal({ status, onClose, onSuccess }) {
  const [statusName, setStatusName] = useState(status.name);
  const [selectedColor, setSelectedColor] = useState(
    statusService.statusColors.find(c => c.value === status.color) || statusService.statusColors[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!statusName.trim()) {
      setError("Status name is required");
      return;
    }

    setLoading(true);
    try {
      await statusService.updateStatus(status._id, {
        name: statusName.trim(),
        color: selectedColor.value,
      });
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Status</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Name
            </label>
            <input
              type="text"
              value={statusName}
              onChange={(e) => {
                setStatusName(e.target.value);
                setError("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {statusService.statusColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`p-2 rounded-lg border-2 transition ${
                    selectedColor.name === color.name
                      ? 'border-blue-600 ring-2 ring-blue-200'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-8 rounded ${color.value.split(' ')[0]}`} />
                  <span className="text-xs text-gray-600 mt-1 block text-center">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmModal({ status, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-red-600">Delete Status</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete <span className="font-semibold">"{status.name}"</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Applications with this status will be moved to "Pending Review".
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Status
          </button>
        </div>
      </div>
    </div>
  );
}