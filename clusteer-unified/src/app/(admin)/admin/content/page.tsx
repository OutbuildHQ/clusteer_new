"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Search,
	Plus,
	Filter,
	MoreVertical,
	Eye,
	Edit,
	Trash2,
	FileText,
	Image as ImageIcon,
	Video,
	Bell,
	Calendar,
	Clock,
	User,
	Tag,
	TrendingUp,
	CheckCircle,
	XCircle,
	AlertCircle,
	Download,
	Upload,
	Copy,
	ExternalLink,
} from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import SearchBar from "@/components/admin/SearchBar";
import { ConfirmModal } from "@/components/admin/Modal";
import { exportTableData } from "@/lib/export-utils";
import { formatDate } from "@/lib/date-utils";

type ContentType = "Blog Post" | "Announcement" | "FAQ" | "Help Article" | "Banner";
type ContentStatus = "Published" | "Draft" | "Scheduled" | "Archived";

interface ContentItem {
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
}

const mockContent: ContentItem[] = [
	{
		id: "CNT-001",
		title: "How to Buy USDT on Clusteer - Complete Guide",
		type: "Blog Post",
		status: "Published",
		author: "Admin Sarah",
		createdDate: "Jan 15, 2025",
		publishDate: "Jan 16, 2025",
		views: 2847,
		category: "Guides",
		tags: ["tutorial", "usdt", "buy"],
		excerpt: "Step-by-step guide on purchasing USDT using our platform...",
		featured: true,
	},
	{
		id: "CNT-002",
		title: "Platform Maintenance - Jan 20, 2025",
		type: "Announcement",
		status: "Scheduled",
		author: "Admin John",
		createdDate: "Jan 14, 2025",
		publishDate: "Jan 20, 2025",
		views: 0,
		category: "Updates",
		tags: ["maintenance", "announcement"],
		excerpt: "We will be performing scheduled maintenance on January 20...",
		featured: false,
	},
	{
		id: "CNT-003",
		title: "What is KYC and Why is it Required?",
		type: "FAQ",
		status: "Published",
		author: "Admin Sarah",
		createdDate: "Jan 10, 2025",
		publishDate: "Jan 10, 2025",
		views: 5234,
		category: "FAQ",
		tags: ["kyc", "verification", "faq"],
		excerpt: "Learn about KYC requirements and why they're important...",
		featured: false,
	},
	{
		id: "CNT-004",
		title: "New Year Welcome Bonus",
		type: "Banner",
		status: "Published",
		author: "Admin John",
		createdDate: "Jan 1, 2025",
		publishDate: "Jan 1, 2025",
		views: 12450,
		category: "Promotions",
		tags: ["bonus", "promotion"],
		excerpt: "Get 5% bonus on your first transaction this January!",
		featured: true,
	},
	{
		id: "CNT-005",
		title: "Understanding Transaction Fees",
		type: "Help Article",
		status: "Published",
		author: "Admin Sarah",
		createdDate: "Dec 28, 2024",
		publishDate: "Jan 5, 2025",
		views: 1823,
		category: "Help Center",
		tags: ["fees", "help", "transactions"],
		excerpt: "A comprehensive breakdown of all transaction fees...",
		featured: false,
	},
	{
		id: "CNT-006",
		title: "Security Best Practices for Your Account",
		type: "Blog Post",
		status: "Draft",
		author: "Admin John",
		createdDate: "Jan 16, 2025",
		publishDate: "-",
		views: 0,
		category: "Security",
		tags: ["security", "2fa", "tips"],
		excerpt: "Learn how to keep your Clusteer account secure...",
		featured: false,
	},
	{
		id: "CNT-007",
		title: "Holiday Trading Hours",
		type: "Announcement",
		status: "Archived",
		author: "Admin Sarah",
		createdDate: "Dec 20, 2024",
		publishDate: "Dec 24, 2024",
		views: 3421,
		category: "Updates",
		tags: ["holiday", "hours"],
		excerpt: "Our platform operating hours during the holiday season...",
		featured: false,
	},
];

export default function ContentPage() {
	const router = useRouter();
	const toast = useToast();
	const [searchQuery, setSearchQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState<"All" | ContentType>("All");
	const [statusFilter, setStatusFilter] = useState<"All" | ContentStatus>("All");
	const [showFilters, setShowFilters] = useState(false);
	const [selectedContent, setSelectedContent] = useState<Set<string>>(new Set());
	const [hoveredRow, setHoveredRow] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
	const [showDuplicateModal, setShowDuplicateModal] = useState<string | null>(null);

	const filteredContent = mockContent.filter((item) => {
		const matchesSearch =
			item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
		const matchesType = typeFilter === "All" || item.type === typeFilter;
		const matchesStatus = statusFilter === "All" || item.status === statusFilter;
		return matchesSearch && matchesType && matchesStatus;
	});

	const stats = {
		total: mockContent.length,
		published: mockContent.filter((c) => c.status === "Published").length,
		drafts: mockContent.filter((c) => c.status === "Draft").length,
		scheduled: mockContent.filter((c) => c.status === "Scheduled").length,
	};

	const getStatusColor = (status: ContentStatus) => {
		switch (status) {
			case "Published":
				return "bg-success/10 text-success border-success";
			case "Draft":
				return "bg-background text-muted-foreground border-border";
			case "Scheduled":
				return "bg-primary/10 text-primary border-primary/30";
			case "Archived":
				return "bg-orange-50 text-orange-700 border-orange-200";
		}
	};

	const getStatusIcon = (status: ContentStatus) => {
		switch (status) {
			case "Published":
				return <CheckCircle className="w-3.5 h-3.5" />;
			case "Draft":
				return <Edit className="w-3.5 h-3.5" />;
			case "Scheduled":
				return <Clock className="w-3.5 h-3.5" />;
			case "Archived":
				return <XCircle className="w-3.5 h-3.5" />;
		}
	};

	const getTypeIcon = (type: ContentType) => {
		switch (type) {
			case "Blog Post":
				return <FileText className="w-4 h-4 text-primary" />;
			case "Announcement":
				return <Bell className="w-4 h-4 text-orange-600" />;
			case "FAQ":
				return <AlertCircle className="w-4 h-4 text-purple-600" />;
			case "Help Article":
				return <FileText className="w-4 h-4 text-success" />;
			case "Banner":
				return <ImageIcon className="w-4 h-4 text-pink-600" />;
		}
	};

	const toggleContentSelection = (id: string) => {
		const newSelection = new Set(selectedContent);
		if (newSelection.has(id)) {
			newSelection.delete(id);
		} else {
			newSelection.add(id);
		}
		setSelectedContent(newSelection);
	};

	const handleBulkAction = async (action: string) => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));

			console.log(`Performing ${action} on:`, Array.from(selectedContent));
			toast.success('Action completed', `${selectedContent.size} content item(s) ${action}ed successfully`);
			setSelectedContent(new Set());
		} catch (error) {
			toast.error('Action failed', 'An error occurred while processing content');
		} finally {
			setIsLoading(false);
		}
	};

	const handleExport = async () => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 800));

			const contentToExport = filteredContent;
			exportTableData({
				filename: `content-export-${new Date().toISOString().split('T')[0]}`,
				columns: [
					{ key: 'title', label: 'Title' },
					{ key: 'type', label: 'Type' },
					{ key: 'status', label: 'Status' },
					{ key: 'author', label: 'Author' },
					{ key: 'publishDate', label: 'Publish Date' },
					{ key: 'views', label: 'Views', format: (val) => val.toString() },
					{ key: 'category', label: 'Category' },
					{ key: 'tags', label: 'Tags', format: (val) => val.join('; ') }
				],
				data: contentToExport,
				format: 'csv'
			});

			toast.success('Export successful', `Exported ${contentToExport.length} content items`);
		} catch (error) {
			toast.error('Export failed', 'An error occurred while exporting content');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteContent = async (contentId: string) => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 800));

			const content = mockContent.find(c => c.id === contentId);
			toast.success('Content deleted', `"${content?.title}" has been permanently deleted`);
			setShowDeleteModal(null);
		} catch (error) {
			toast.error('Delete failed', 'An error occurred while deleting content');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDuplicateContent = async (contentId: string) => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 800));

			const content = mockContent.find(c => c.id === contentId);
			toast.success('Content duplicated', `"${content?.title}" has been duplicated successfully`);
			setShowDuplicateModal(null);
		} catch (error) {
			toast.error('Duplicate failed', 'An error occurred while duplicating content');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{isLoading && <LoadingSpinner overlay />}

			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Content Management</h1>
					<p className="text-sm text-muted-foreground mt-1">Create and manage platform content</p>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={handleExport}
						className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg hover:bg-background transition-colors"
					>
						<Download className="w-4 h-4" />
						Export
					</button>
					<button
						onClick={() => router.push("/admin/content/new")}
						className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
					>
						<Plus className="w-4 h-4" />
						New Content
					</button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100 p-6 hover:shadow-lg transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-slate-100 rounded-lg">
							<FileText className="w-6 h-6 text-slate-600" />
						</div>
					</div>
					<p className="text-sm text-muted-foreground font-medium mb-1">Total Content</p>
					<p className="text-3xl font-bold text-foreground mb-2">{stats.total}</p>
					<p className="text-xs text-slate-600 font-medium">All content items</p>
				</div>

				<div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 p-6 hover:shadow-lg transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-success/10 rounded-lg">
							<CheckCircle className="w-6 h-6 text-success" />
						</div>
					</div>
					<p className="text-sm text-muted-foreground font-medium mb-1">Published</p>
					<p className="text-3xl font-bold text-foreground mb-2">{stats.published}</p>
					<p className="text-xs text-success font-medium">Live content</p>
				</div>

				<div className="bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-100 p-6 hover:shadow-lg transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-amber-100 rounded-lg">
							<Edit className="w-6 h-6 text-warning" />
						</div>
					</div>
					<p className="text-sm text-muted-foreground font-medium mb-1">Drafts</p>
					<p className="text-3xl font-bold text-foreground mb-2">{stats.drafts}</p>
					<p className="text-xs text-warning font-medium">In progress</p>
				</div>

				<div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-6 hover:shadow-lg transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-primary/10 rounded-lg">
							<Clock className="w-6 h-6 text-primary" />
						</div>
					</div>
					<p className="text-sm text-muted-foreground font-medium mb-1">Scheduled</p>
					<p className="text-3xl font-bold text-foreground mb-2">{stats.scheduled}</p>
					<p className="text-xs text-primary font-medium">Future publish</p>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="bg-card rounded-lg border border-border p-4 space-y-4">
				<div className="flex items-center gap-4">
					<div className="flex-1">
						<SearchBar
							value={searchQuery}
							onChange={setSearchQuery}
							placeholder="Search content by title, excerpt, or tags..."
						/>
					</div>
					<button
						onClick={() => setShowFilters(!showFilters)}
						className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg hover:bg-background transition-colors"
					>
						<Filter className="w-4 h-4" />
						Filters
					</button>
				</div>

				{showFilters && (
					<div className="grid grid-cols-2 gap-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2 duration-200">
						<div>
							<label className="block text-sm font-medium text-muted-foreground mb-2">Type</label>
							<select
								value={typeFilter}
								onChange={(e) => setTypeFilter(e.target.value as any)}
								className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
							>
								<option value="All">All Types</option>
								<option value="Blog Post">Blog Post</option>
								<option value="Announcement">Announcement</option>
								<option value="FAQ">FAQ</option>
								<option value="Help Article">Help Article</option>
								<option value="Banner">Banner</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value as any)}
								className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
							>
								<option value="All">All Statuses</option>
								<option value="Published">Published</option>
								<option value="Draft">Draft</option>
								<option value="Scheduled">Scheduled</option>
								<option value="Archived">Archived</option>
							</select>
						</div>
					</div>
				)}

				<div className="flex items-center justify-between text-sm">
					<p className="text-muted-foreground">
						Showing <span className="font-semibold">{filteredContent.length}</span> content items
					</p>
					{selectedContent.size > 0 && (
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground">{selectedContent.size} selected</span>
							<button
								onClick={() => handleBulkAction("publish")}
								className="px-3 py-1 text-xs font-medium bg-success/10 text-success rounded hover:bg-success/10"
							>
								Publish
							</button>
							<button
								onClick={() => handleBulkAction("archive")}
								className="px-3 py-1 text-xs font-medium bg-orange-50 text-orange-700 rounded hover:bg-orange-100"
							>
								Archive
							</button>
							<button
								onClick={() => handleBulkAction("delete")}
								className="px-3 py-1 text-xs font-medium bg-danger/10 text-danger rounded hover:bg-danger/10"
							>
								Delete
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Content Table */}
			<div className="bg-card rounded-lg border border-border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-background border-b border-border">
							<tr>
								<th className="w-12 py-3 px-4">
									<input
										type="checkbox"
										checked={selectedContent.size === filteredContent.length && filteredContent.length > 0}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedContent(new Set(filteredContent.map((c) => c.id)));
											} else {
												setSelectedContent(new Set());
											}
										}}
										className="w-4 h-4 rounded border-border cursor-pointer"
									/>
								</th>
								<th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Title</th>
								<th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Type</th>
								<th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
								<th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Author</th>
								<th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Publish Date</th>
								<th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Views</th>
								<th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{filteredContent.map((item) => (
								<tr
									key={item.id}
									className="hover:bg-background transition-colors group"
									onMouseEnter={() => setHoveredRow(item.id)}
									onMouseLeave={() => setHoveredRow(null)}
								>
									<td className="py-4 px-4">
										<input
											type="checkbox"
											checked={selectedContent.has(item.id)}
											onChange={() => toggleContentSelection(item.id)}
											className="w-4 h-4 rounded border-border cursor-pointer"
										/>
									</td>
									<td className="py-4 px-4">
										<div className="flex items-center gap-3">
											{item.featured && (
												<div className="w-1 h-10 bg-[#B8E632] rounded"></div>
											)}
											<div className="flex-1">
												<p className="text-sm font-medium text-foreground">{item.title}</p>
												<p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.excerpt}</p>
												<div className="flex items-center gap-1 mt-1">
													{item.tags.slice(0, 2).map((tag, idx) => (
														<span
															key={idx}
															className="inline-flex items-center px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded"
														>
															{tag}
														</span>
													))}
													{item.tags.length > 2 && (
														<span className="text-xs text-muted-foreground">+{item.tags.length - 2}</span>
													)}
												</div>
											</div>
										</div>
									</td>
									<td className="py-4 px-4">
										<div className="flex items-center gap-2">
											{getTypeIcon(item.type)}
											<span className="text-sm text-foreground">{item.type}</span>
										</div>
									</td>
									<td className="py-4 px-4">
										<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
											{getStatusIcon(item.status)}
											{item.status}
										</span>
									</td>
									<td className="py-4 px-4">
										<div className="flex items-center gap-2">
											<div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
												<User className="w-4 h-4 text-muted-foreground" />
											</div>
											<span className="text-sm text-foreground">{item.author}</span>
										</div>
									</td>
									<td className="py-4 px-4">
										<div className="flex items-center gap-2">
											<Calendar className="w-4 h-4 text-muted-foreground" />
											<span className="text-sm text-foreground">{item.publishDate}</span>
										</div>
									</td>
									<td className="py-4 px-4">
										<div className="flex items-center gap-2">
											<TrendingUp className="w-4 h-4 text-muted-foreground" />
											<span className="text-sm font-medium text-foreground">{item.views.toLocaleString()}</span>
										</div>
									</td>
									<td className="py-4 px-4">
										{hoveredRow === item.id ? (
											<div className="flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-200">
												<button
													onClick={() => router.push(`/admin/content/${item.id}`)}
													className="p-1.5 hover:bg-muted rounded-lg transition-colors"
													title="View content"
												>
													<Eye className="w-4 h-4 text-muted-foreground" />
												</button>
												<button
													onClick={() => router.push(`/admin/content/${item.id}`)}
													className="p-1.5 hover:bg-muted rounded-lg transition-colors"
													title="Edit content"
												>
													<Edit className="w-4 h-4 text-muted-foreground" />
												</button>
												<button
													onClick={() => setShowDuplicateModal(item.id)}
													className="p-1.5 hover:bg-muted rounded-lg transition-colors"
													title="Duplicate content"
												>
													<Copy className="w-4 h-4 text-muted-foreground" />
												</button>
												<button
													onClick={() => setShowDeleteModal(item.id)}
													className="p-1.5 hover:bg-muted rounded-lg transition-colors"
													title="Delete content"
												>
													<Trash2 className="w-4 h-4 text-danger" />
												</button>
											</div>
										) : (
											<div className="w-full h-8"></div>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{filteredContent.length === 0 && (
					<div className="text-center py-12">
						<FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
						<h3 className="text-sm font-medium text-foreground mb-1">No content found</h3>
						<p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
					</div>
				)}
			</div>

			{/* Delete Confirmation Modal */}
			<ConfirmModal
				isOpen={!!showDeleteModal}
				onClose={() => setShowDeleteModal(null)}
				onConfirm={() => showDeleteModal && handleDeleteContent(showDeleteModal)}
				title="Delete Content?"
				message="This action cannot be undone. This will permanently delete this content item and it will no longer be visible to users."
				confirmText="Delete Content"
				variant="danger"
			/>

			{/* Duplicate Confirmation Modal */}
			<ConfirmModal
				isOpen={!!showDuplicateModal}
				onClose={() => setShowDuplicateModal(null)}
				onConfirm={() => showDuplicateModal && handleDuplicateContent(showDuplicateModal)}
				title="Duplicate Content?"
				message="This will create a copy of this content item as a draft. You can edit and publish it later."
				confirmText="Duplicate Content"
				variant="info"
			/>
		</div>
	);
}

