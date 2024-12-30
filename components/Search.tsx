import React, { useState, useEffect, useRef } from 'react';
import {
    Input,
    Button,
    Image,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Pagination,
} from "@nextui-org/react";
import { Search } from 'lucide-react';

interface Post {
    id: string;
    fileUrl: string;
    previewUrl: string;
    tags: string;
    type: 'image' | 'video';
}

const SearchInput = () => {
    const [value, setValue] = useState("");
    const [results, setResults] = useState<Post[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const postsPerPage = 50;

    const inputRef = useRef<HTMLInputElement>(null);

    // Функция для парсинга XML
    const parseXML = (xmlString: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        const posts = Array.from(xmlDoc.getElementsByTagName("post"));
        const count = Number(xmlDoc.querySelector("posts")?.getAttribute("count")) || 0; // Получаем count
        return {
            posts: posts.map((post) => ({
                id: post.getAttribute("id"),
                fileUrl: post.getAttribute("file_url"),
                previewUrl: post.getAttribute("preview_url"),
                tags: post.getAttribute("tags"),
                type: post.getAttribute("file_url")?.endsWith(".mp4") ? 'video' : 'image',
            })),
            count
        };
    };

    // Функция для поиска постов
    const handleSearch = async (page: number = 1) => {
        setLoading(true);
        try {
            const proxyUrl = "http://192.168.0.207:8080/";
            const apiUrl = `https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${value.replace(/\s+/g, '+')}&limit=${postsPerPage}&pid=${page - 1}`;
            const response = await fetch(`${proxyUrl}${apiUrl}`);
            const xmlData = await response.text();
            const { posts, count } = parseXML(xmlData);
            setResults(posts);
            setTotalPages(Math.ceil(count / postsPerPage)); // Рассчитываем количество страниц
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Функция для автозаполнения тегов
    const handleTagSearch = async (query: string) => {
        const lastTag = query.trim().split(" ").pop() || "";
        if (lastTag.length < 3) {
            setTags([]);
            return;
        }
        try {
            const proxyUrl = "http://192.168.0.207:8080/";
            const apiUrl = `https://ac.rule34.xxx/autocomplete.php?q=${lastTag}`;
            const response = await fetch(`${proxyUrl}${apiUrl}`);
            const data = await response.json();
            setTags(data);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    // Обработчик нажатия клавиши
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // Обработчик изменения строки поиска
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        handleTagSearch(e.target.value);
    };

    // Обработчик клика по предложению
    const handleTagClick = (tag: string) => {
        const newValue = value.trim().split(" ");
        newValue.pop();
        newValue.push(tag);
        setValue(newValue.join(" ") + " ");
        setTags([]);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    useEffect(() => {
        if (value === "") {
            setTags([]);
        }
    }, [value]);

    useEffect(() => {
        handleSearch(currentPage);
    }, [currentPage]);

    // Обработчик клика по медиа (изображению или видео)
    const handleMediaClick = (media: { url: string, type: 'image' | 'video' }) => {
        setSelectedMedia(media);
        onOpen();
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    return (
        <div className="relative w-[99vw] flex flex-col items-center justify-center">
            <div className="flex items-center space-x-2 max-w-[454.883px]">
                <Input
                    ref={inputRef}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search posts..."
                    startContent={
                        <Search className="h-5 w-5 text-gray-400" />
                    }
                    classNames={{
                        input: "text-sm",
                        inputWrapper: "px-3",
                    }}
                />
                <Button onPress={() => handleSearch(1)} className="bg-blue-500 text-white">
                    Search
                </Button>
            </div>
            <div className='w-full flex justify-center'>
                {tags.length > 0 && (
                    <div className=" mt-1 w-[454.883px] bg-black border-2 border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                        <ul>
                            {tags.map((tag, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleTagClick(tag.value)}
                                    className="p-2 hover:bg-gray-700 cursor-pointer"
                                >
                                    {tag.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {results.length > 0 && (
                <div className='w-full flex justify-center mt-4'>
                    <Pagination
                        total={totalPages}
                        initialPage={1}
                        page={currentPage}
                        onChange={handlePageChange}
                    />
                </div>
            )}
            <div className="mt-4 flex flex-wrap items-center justify-center content-stretch gap-[10px]">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    results.map((result) => (
                        <div key={result.id} className="">
                            {/* Для видео используем previewUrl */}
                            {result.type === 'video' ? (
                                <div
                                    className="h-[300px] w-[300px] border-4 border-blue-500 rounded-md overflow-hidden relative group"
                                    onClick={() => handleMediaClick({ url: result.fileUrl, type: 'video' })}
                                >
                                    <Image
                                        src={result.previewUrl}
                                        alt={result.tags}
                                        width={8196}
                                        className="h-[300px] w-[300px] inset-0 object-cover text-transparent rounded-md"
                                    />
                                </div>
                            ) : (
                                <Image
                                    isZoomed
                                    isBlurred
                                    onClick={() => handleMediaClick({ url: result.fileUrl, type: 'image' })}
                                    src={result.previewUrl}
                                    alt={result.tags}
                                    width={8196}
                                    className="h-[300px] w-[300px] inset-0 object-cover text-transparent rounded-md"
                                />
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Модальное окно для увеличенного изображения или видео */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl" scrollBehavior='inside'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Media Preview</ModalHeader>
                            <ModalBody>
                                {selectedMedia?.type === 'video' ? (
                                    <video
                                        src={selectedMedia.url}
                                        controls
                                        className="max-h-[80vh] max-w-full"
                                    />
                                ) : (
                                    <Image
                                        src={selectedMedia?.url || ""}
                                        alt="Full Size Image"
                                        width="auto"
                                        height="auto"
                                        className="max-h-[80vh] max-w-full"
                                    />
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default SearchInput;