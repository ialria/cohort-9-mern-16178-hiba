const prisma = require("../config/prisma");
const logger = require("../utilities/logger");

const createNote = async (req, res) => {
  try {
    const { title, noteContent } = req.body;
    if (!noteContent) {
      return res
        .status(400)
        .json({ message: "Note content is required" });
    }
    const note = await prisma.note.create({
      data: {
        title:title?.trim() || "Untitled Note",
        content: noteContent,
        userId: req.userId,
      },
    });
    return res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    logger.error(
      {
        error: {
          name: error.name,
          message: error.message,
        },
      },
      "Note creation failed",
    );

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getAllNotes=async (req, res)=>{
try{
    const allNotes=await prisma.note.findMany({
        where :{
            userId:req.userId
        },
        orderBy:{
            updatedAt:"desc",
        }
    });
     return res.status(200).json({
      allNotes,
    });
}
catch (error){
    logger.error(
      {
        error: {
          name: error.name,
          message: error.message,
        },
      },
      "Fetching notes failed",
    );

    return res.status(500).json({
      message: "Something went wrong",
    });
}
};
const updateNote=async (req, res)=>{
try {
    const { noteId } = req.params;
    const parsedNoteId = Number(noteId);

if (!Number.isInteger(parsedNoteId) || parsedNoteId <= 0) {
  return res.status(400).json({
    message: "Invalid note ID",
  });
}
    const { title, noteContent } = req.body;

    const note = await prisma.note.findFirst({
      where: {
        id: parsedNoteId,
        userId: req.userId,
      },
    });

    if (!note) {
      return res.status(404).json({
        message: "Couldn't find note",
      });
    }

    const updatedNote = await prisma.note.update({
      where: {
        id: note.id,
      },
      data: {
        title: title?.trim() || "Untitled Note",
        content: noteContent,
        editedAt: new Date(),
      },
    });

    return res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    logger.error(
      {
        error: {
          name: error.name,
          message: error.message,
        },
      },
      "Note update failed",
    );

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const toggleFavourite = async (req, res) => {
  try {
    const { noteId } = req.params;
    const parsedNoteId = Number(noteId);

if (!Number.isInteger(parsedNoteId) || parsedNoteId <= 0) {
  return res.status(400).json({
    message: "Invalid note ID",
  });
}
    const note = await prisma.note.findFirst({
      where: {
        id: parsedNoteId,
        userId: req.userId,
      },
    });
    if (!note) {
      return res.status(404).json({
        message: "Couldn't find note",
      });
    }

    const targetFavorite = !note.isFavorite;

    const result = await prisma.note.updateMany({
      where: {
        id: note.id,
        userId: req.userId,
        isFavorite: note.isFavorite,
      },
      data: {
        isFavorite: targetFavorite,
      },
    });

    if (result.count === 0) {
      return res.status(409).json({
        message: "Note was updated by another request. Please try again.",
      });
    }
    const updatedNote = await prisma.note.findUnique({
      where: {
        id: note.id,
      }
    });
    return res.status(200).json({
      message: "Favourite status updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    logger.error(
      {
        error: {
          name: error.name,
          message: error.message,
        },
      },
      "Updating favourite status failed",
    );
    return res.status(500).json({
      message: "Error! Something went wrong",
    });
  }
};

const moveToTrash = async (req, res) => {
  try {
    const { noteId } = req.params;
    const parsedNoteId = Number(noteId);

if (!Number.isInteger(parsedNoteId) || parsedNoteId <= 0) {
  return res.status(400).json({
    message: "Invalid note ID",
  });
}
    const note = await prisma.note.findFirst({
      where: {
        id: parsedNoteId,
        userId: req.userId,
      },
    });
    if (!note) {
      return res.status(404).json({
        message: "Couldn't find note",
      });
    }
    const updatedNote = await prisma.note.update({
      where: {
        id: note.id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    return res.status(200).json({
      message: "Note moved to Trash successfully",
      note: updatedNote,
    });
  } catch (error) {
    logger.error({error},"MOVE TO TRASH ERROR");
    logger.error(
      {
        error: {
          name: error.name,
          message: error.message,
        },
      },
      "Error! Could not move Note to Trash",
    );
    return res.status(500).json({
      message: "Error! Something went wrong",
    });
  }
};

const restoreNote=async (req, res)=>{
    try{
const {noteId}=req.params;
const parsedNoteId=Number(noteId);
 if (!Number.isInteger(parsedNoteId) || parsedNoteId <= 0) {
      return res.status(400).json({
        message: "Invalid note ID",
      });
    }
    const note = await prisma.note.findFirst({
      where: {
        id: parsedNoteId,
        userId: req.userId,
        isDeleted: true,
      },
    });
    if (!note) {
      return res.status(404).json({
        message: "Couldn't find deleted note",
      });
    }
     const restoredNote = await prisma.note.update({
      where: {
        id: note.id,
      },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
     return res.status(200).json({
      message: "Note restored successfully",
      note: restoredNote,
    });
    }catch(error){
logger.error(
      {
        error: {
          name: error.name,
          message: error.message,
        },
      },
      "Note restoration failed",
    );

    return res.status(500).json({
      message: "Something went wrong",
    });
    }
};
const deleteForever = async (req, res) => {
  try {
    const { noteId } = req.params;
    const parsedNoteId = Number(noteId);

    if (!Number.isInteger(parsedNoteId) || parsedNoteId <= 0) {
      return res.status(400).json({
        message: "Error! Invalid note ID",
      });
    }
    const note = await prisma.note.findFirst({
      where: {
        id: parsedNoteId,
        userId: req.userId,
        isDeleted: true,
      },
    });
    if (!note) {
      return res.status(404).json({
        message: "Couldn't find note",
      });
    }
    await prisma.note.delete({
      where: {
        id: note.id,
      },
    });
    return res.status(200).json({
      message: "Note permanently deleted",
    });
  } catch (error) {
    logger.error(
      {
        error: {
          name: error.name,
          message: error.message,
        },
      },
      "Error! Permanent note deletion failed",
    );
    return res.status(500).json({
      message: "Error! Something went wrong",
    });
  }
};

module.exports = {
  createNote, getAllNotes, toggleFavourite , moveToTrash, updateNote, restoreNote, deleteForever
};
