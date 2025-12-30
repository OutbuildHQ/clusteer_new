"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	ArrowLeft,
	Save,
	Eye,
	Trash2,
	Calendar,
	Tag,
	Globe,
	Image as ImageIcon,
	FileText,
	X,
	Plus,
	AlertCircle,
	Clock,
	User,
	ChevronRight,
} from "lucide-react";

type ContentType = "Blog Post" | "Announcement" | "FAQ" | "Help Article" | "Banner";
type ContentStatus = "Published" | "Draft" | "Scheduled" | "Archived";

interface ContentDetail {
	id: string;
	title: string;
	type: ContentType;
	status: ContentStatus;
	author: string;
	createdDate: string;
	publishDate: string;
	views: number;
	category: string;
	tags: string[];
	excerpt: string;
	featured: boolean;
	content: string;
	seoTitle: string;
	seoDescription: string;
	featuredImage: string | null;
}

const mockContent: ContentDetail = {
	id: "1",
	title: "How to Buy USDT on Clusteer",
	type: "Blog Post",
	status: "Published",
	author: "Admin Sarah",
	createdDate: "Jan 10, 2025",
	publishDate: "Jan 15, 2025",
	views: 1234,
	category: "Tutorials",
	tags: ["USDT", "Tutorial", "Getting Started"],
	excerpt: "Learn how to buy USDT quickly and securely on the Clusteer platform",
	featured: true,
	content: `# How to Buy USDT on Clusteer

Welcome to our comprehensive guide on buying USDT on Clusteer. This tutorial will walk you through the entire process step by step.

## Step 1: Create an Account

First, you'll need to create an account on Clusteer. Click the "Sign Up" button and fill in your details.

## Step 2: Complete KYC Verification

For security purposes, you'll need to complete our KYC verification process. This typically takes 24-48 hours.

## Step 3: Fund Your Naira Wallet

Navigate to your wallet and select "Add Funds" to deposit Naira into your account.

## Step 4: Buy USDT

Once your wallet is funded, you can purchase USDT at the current market rate.

## Conclusion

Buying USDT on Clusteer is simple and secure. If you have any questions, please contact our support team.`,
	seoTitle: "How to Buy USDT on Clusteer - Complete Guide 2025",
	seoDescription: "Step-by-step guide to buying USDT on Clusteer. Learn the fastest and most secure way to purchase USDT in Nigeria.",
	featuredImage: null,
};

export default function ContentDetailPage() {
	const params = useParams();
	const router = useRouter();
	const contentId = params.id as string;

	const [content, setContent] = useState<ContentDetail>(mockContent);
	const [isEditing, setIsEditing] = useState(contentId === "new");
	const [showPreview, setShowPreview] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [newTag, setNewTag] = useState("");
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	const handleSave = () => {
		console.log("Saving content:", content);
		setHasUnsavedChanges(false);
		setIsEditing(false);
		// TODO: Save to backend
	};

	const handlePublish = () => {
		setContent({ ...content, status: "Published", publishDate: new Date().toLocaleDateString() });
		handleSave();
	};

	const handleDelete = () => {
		console.log("Deleting content:", contentId);
		setShowDeleteModal(false);
		router.push("/admin/content");
		// TODO: Delete from backend
	};

	const addTag = () => {
		if (newTag.trim() && !content.tags.includes(newTag.trim())) {
			setContent({ ...content, tags: [...content.tags, newTag.trim()] });
			setNewTag("");
			setHasUnsavedChanges(true);
		}
	};

	const removeTag = (tagToRemove: string) => {
		setContent({ ...content, tags: content.tags.filter(tag => tag !== tagToRemove) });
		setHasUnsavedChanges(true);
	};

	const getStatusColor = (status: ContentStatus) => {
		switch (status) {
			case "Published":
				return "bg-green-50 text-green-700 border-green-200";
			case "Draft":
				return "bg-gray-50 text-gray-700 border-gray-200";
			case "Scheduled":
				return "bg-blue-50 text-blue-700 border-blue-200";
			case "Archived":
				return "bg-orange-50 text-orange-700 border-orange-200";
			default:
				return "bg-gray-50 text-gray-700 border-gray-200";
		}
	};

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<nav className="flex items-center gap-2 text-sm text-gray-500">
				<button onClick={() => router.push("/admin")} className="hover:text-gray-900">
					Dashboard
				</button>
				<ChevronRight className="w-4 h-4" />
				<button onClick={() => router.push("/admin/content")} className="hover:text-gray-900">
					Content
				</button>
				<ChevronRight className="w-4 h-4" />
				<span className="font-medium text-gray-900">
					{contentId === "new" ? "New Content" : content.title}
				</span>
			</nav>

			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.push("/admin/content")}
						className="p-2 hover:bg-[#FAFAFA] rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5 text-gray-600" />
					</button>
					<div>
						<h1 className="text-2xl font-semibold text-gray-900">
							{contentId === "new" ? "Create New Content" : content.title}
						</h1>
						<div className="flex items-center gap-3 mt-1">
							<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(content.status)}`}>
								{content.status}
							</span>
							{content.featured && (
								<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#E7F6EC] text-[#014F01] border border-[#014F01]">
									Featured
								</span>
							)}
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3">
					{hasUnsavedChanges && (
						<div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
							<AlertCircle className="w-4 h-4 text-orange-600" />
							<span className="text-sm text-orange-700">Unsaved changes</span>
						</div>
					)}
					<button
						onClick={() => setShowPreview(true)}
						className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors"
					>
						<Eye className="w-4 h-4" />
						Preview
					</button>
					{content.status !== "Published" && (
						<button
							onClick={handlePublish}
							className="flex items-center gap-2 px-4 py-2 bg-[#B8E632] text-gray-900 rounded-lg hover:bg-[#a8d622] transition-colors shadow-sm"
						>
							<Globe className="w-4 h-4" />
							Publish
						</button>
					)}
					{isEditing ? (
						<button
							onClick={handleSave}
							className="flex items-center gap-2 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors shadow-sm"
						>
							<Save className="w-4 h-4" />
							Save
						</button>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className="flex items-center gap-2 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors shadow-sm"
						>
							Edit
						</button>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Content Area */}
				<div className="lg:col-span-2 space-y-6">
					{/* Basic Information */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-6">Content Details</h2>

						<div className="space-y-4">
							{/* Title */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Title <span className="text-red-600">*</span>
								</label>
								<input
									type="text"
									value={content.title}
									onChange={(e) => {
										setContent({ ...content, title: e.target.value });
										setHasUnsavedChanges(true);
									}}
									disabled={!isEditing}
									className="w-full px-4 py-2.5 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
									placeholder="Enter content title"
								/>
							</div>

							{/* Excerpt */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Excerpt <span className="text-red-600">*</span>
								</label>
								<textarea
									value={content.excerpt}
									onChange={(e) => {
										setContent({ ...content, excerpt: e.target.value });
										setHasUnsavedChanges(true);
									}}
									disabled={!isEditing}
									rows={3}
									className="w-full px-4 py-2.5 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
									placeholder="Brief summary of the content"
								/>
							</div>

							{/* Content Body */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Content <span className="text-red-600">*</span>
								</label>
								<textarea
									value={content.content}
									onChange={(e) => {
										setContent({ ...content, content: e.target.value });
										setHasUnsavedChanges(true);
									}}
									disabled={!isEditing}
									rows={20}
									className="w-full px-4 py-2.5 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 font-mono"
									placeholder="Enter content in Markdown format"
								/>
								<p className="text-xs text-gray-500 mt-2">Supports Markdown formatting</p>
							</div>
						</div>
					</div>

					{/* SEO Settings */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-6">SEO Settings</h2>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									SEO Title
								</label>
								<input
									type="text"
									value={content.seoTitle}
									onChange={(e) => {
										setContent({ ...content, seoTitle: e.target.value });
										setHasUnsavedChanges(true);
									}}
									disabled={!isEditing}
									className="w-full px-4 py-2.5 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
									placeholder="SEO optimized title"
								/>
								<p className="text-xs text-gray-500 mt-1">
									{content.seoTitle.length}/60 characters
								</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Meta Description
								</label>
								<textarea
									value={content.seoDescription}
									onChange={(e) => {
										setContent({ ...content, seoDescription: e.target.value });
										setHasUnsavedChanges(true);
									}}
									disabled={!isEditing}
									rows={3}
									className="w-full px-4 py-2.5 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
									placeholder="SEO meta description"
								/>
								<p className="text-xs text-gray-500 mt-1">
									{content.seoDescription.length}/160 characters
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Publishing Options */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
						<h3 className="text-sm font-semibold text-gray-900 mb-4">Publishing</h3>

						<div className="space-y-4">
							{/* Status */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Status
								</label>
								<select
									value={content.status}
									onChange={(e) => {
										setContent({ ...content, status: e.target.value as ContentStatus });
										setHasUnsavedChanges(true);
									}}
									disabled={!isEditing}
									className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
								>
									<option value="Draft">Draft</option>
									<option value="Published">Published</option>
									<option value="Scheduled">Scheduled</option>
									<option value="Archived">Archived</option>
								</select>
							</div>

							{/* Publish Date */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									<Calendar className="w-4 h-4 inline mr-1" />
									Publish Date
								</label>
								<input
									type="date"
									value={content.publishDate}
									onChange={(e) => {
										setContent({ ...content, publishDate: e.target.value });
										setHasUnsavedChanges(true);
									}}
									disabled={!isEditing}
									className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
								/>
							</div>

							{/* Featured Toggle */}
							<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
								<div>
									<label className="text-sm font-medium text-gray-900 block">
										Featured Content
									</label>
									<p className="text-xs text-gray-600">Show on homepage</p>
								</div>
								<input
									type="checkbox"
									checked={content.featured}
									onChange={(e) => {
										setContent({ ...content, featured: e.target.checked });
										setHasUnsavedChanges(true);
									}}
									disabled={!isEditing}
									className="w-4 h-4 rounded border-gray-300 text-[#014F01] focus:ring-[#014F01]"
								/>
							</div>
						</div>
					</div>

					{/* Content Type & Category */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
						<h3 className="text-sm font-semibold text-gray-900 mb-4">Classification</h3>

						<div className="space-y-4">
							{/* Type */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Content Type
								</label>
								<select
									value={content.type}
									onChange={(e) => {
										setContent({ ...content, type: e.target.value as ContentType });
										setHasUnsavedChanges(true);
									}}
									disabled={!isEditing}
									className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
								>
									<option value="Blog Post">Blog Post</option>
									<option value="Announcement">Announcement</option>
									<option value="FAQ">FAQ</option>
									<option value="Help Article">Help Article</option>
									<option value="Banner">Banner</option>
								</select>
							</div>

							{/* Category */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Category
								</label>
								<input
									type="text"
									value={content.category}
									onChange={(e) => {
										setContent({ ...content, category: e.target.value });
										setHasUnsavedChanges(true);
									}}
									disabled={!isEditing}
									className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
									placeholder="e.g., Tutorials, News"
								/>
							</div>
						</div>
					</div>

					{/* Tags */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
						<h3 className="text-sm font-semibold text-gray-900 mb-4">
							<Tag className="w-4 h-4 inline mr-1" />
							Tags
						</h3>

						<div className="space-y-3">
							{/* Existing Tags */}
							<div className="flex flex-wrap gap-2">
								{content.tags.map((tag, index) => (
									<span
										key={index}
										className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
									>
										{tag}
										{isEditing && (
											<button
												onClick={() => removeTag(tag)}
												className="hover:text-red-600 transition-colors"
											>
												<X className="w-3 h-3" />
											</button>
										)}
									</span>
								))}
							</div>

							{/* Add Tag */}
							{isEditing && (
								<div className="flex gap-2">
									<input
										type="text"
										value={newTag}
										onChange={(e) => setNewTag(e.target.value)}
										onKeyPress={(e) => e.key === "Enter" && addTag()}
										className="flex-1 px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
										placeholder="Add tag..."
									/>
									<button
										onClick={addTag}
										className="p-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors"
									>
										<Plus className="w-4 h-4" />
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Featured Image */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
						<h3 className="text-sm font-semibold text-gray-900 mb-4">
							<ImageIcon className="w-4 h-4 inline mr-1" />
							Featured Image
						</h3>

						{content.featuredImage ? (
							<div className="space-y-3">
								<div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
									<FileText className="w-12 h-12 text-gray-400" />
								</div>
								{isEditing && (
									<button
										onClick={() => {
											setContent({ ...content, featuredImage: null });
											setHasUnsavedChanges(true);
										}}
										className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
									>
										<Trash2 className="w-4 h-4" />
										Remove Image
									</button>
								)}
							</div>
						) : (
							<button
								disabled={!isEditing}
								className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#014F01] hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
								<p className="text-sm text-gray-600">Upload Image</p>
								<p className="text-xs text-gray-500 mt-1">Max 2MB</p>
							</button>
						)}
					</div>

					{/* Metadata */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
						<h3 className="text-sm font-semibold text-gray-900 mb-4">Metadata</h3>

						<div className="space-y-3 text-sm">
							<div className="flex items-center justify-between py-2 border-b border-gray-100">
								<span className="text-gray-600 flex items-center gap-2">
									<User className="w-4 h-4" />
									Author
								</span>
								<span className="font-medium text-gray-900">{content.author}</span>
							</div>
							<div className="flex items-center justify-between py-2 border-b border-gray-100">
								<span className="text-gray-600 flex items-center gap-2">
									<Clock className="w-4 h-4" />
									Created
								</span>
								<span className="font-medium text-gray-900">{content.createdDate}</span>
							</div>
							<div className="flex items-center justify-between py-2">
								<span className="text-gray-600 flex items-center gap-2">
									<Eye className="w-4 h-4" />
									Views
								</span>
								<span className="font-medium text-gray-900">{content.views.toLocaleString()}</span>
							</div>
						</div>
					</div>

					{/* Danger Zone */}
					{contentId !== "new" && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-6">
							<h3 className="text-sm font-semibold text-red-900 mb-2">Danger Zone</h3>
							<p className="text-xs text-red-700 mb-4">
								Deleting content is permanent and cannot be undone
							</p>
							<button
								onClick={() => setShowDeleteModal(true)}
								className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
							>
								<Trash2 className="w-4 h-4" />
								Delete Content
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Preview Modal */}
			{showPreview && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<div className="sticky top-0 bg-white border-b border-[#E9EAEB] p-6">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold text-gray-900">Content Preview</h2>
								<button
									onClick={() => setShowPreview(false)}
									className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<X className="w-5 h-5 text-gray-600" />
								</button>
							</div>
						</div>
						<div className="p-6">
							<h1 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h1>
							<div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
								<span>{content.author}</span>
								<span>•</span>
								<span>{content.publishDate}</span>
								<span>•</span>
								<span>{content.views} views</span>
							</div>
							<div className="prose max-w-none">
								<pre className="whitespace-pre-wrap font-sans text-gray-800">
									{content.content}
								</pre>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-md w-full p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
								<AlertCircle className="w-6 h-6 text-red-600" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-gray-900">Delete Content</h3>
								<p className="text-sm text-gray-600">This action cannot be undone</p>
							</div>
						</div>

						<p className="text-sm text-gray-700 mb-6">
							Are you sure you want to delete "<strong>{content.title}</strong>"? This will
							permanently remove the content and all associated data.
						</p>

						<div className="flex items-center gap-3">
							<button
								onClick={() => setShowDeleteModal(false)}
								className="flex-1 px-4 py-2 bg-white border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleDelete}
								className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
							>
								Delete Content
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
