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
    const { title, noteContent } = req.body;

    const note = await prisma.note.findFirst({
      where: {
        id: Number(noteId),
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
    const note = await prisma.note.findFirst({
      where: {
        id: Number(noteId),
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
        isFavorite: !note.isFavorite,
      },
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
    const note = await prisma.note.findFirst({
      where: {
        id: Number(noteId),
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
    console.error("MOVE TO TRASH ERROR:", error);
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

module.exports = {
  createNote, getAllNotes, toggleFavourite , moveToTrash, updateNote
};
