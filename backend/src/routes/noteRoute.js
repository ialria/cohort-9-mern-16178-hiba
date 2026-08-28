const express=require("express");
const router=express.Router();

const authMiddleware=require("../middleware/authMiddleware");
const {createNote, getAllNotes, togglePin, moveToTrash, updateNote, restoreNote, deleteForever}=require("../controllers/noteController");

router.post("/",authMiddleware, createNote);
router.get("/",authMiddleware,getAllNotes);
router.patch("/:noteId/pin",authMiddleware,togglePin);
router.patch("/:noteId/trash",authMiddleware, moveToTrash);
router.patch("/:noteId", authMiddleware, updateNote);
router.patch("/:noteId/restore",authMiddleware, restoreNote);
router.delete("/:noteId",authMiddleware, deleteForever);

module.exports=router;