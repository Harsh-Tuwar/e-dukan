'use client'

import { useEffect, useState } from 'react';

import { Product } from '@/payload-types';
import { useCart } from '@/hooks/use-cart';

import { Button } from './ui/button';

const AddToCartButton = ({
	product,
}: {
	product: Product
}) => {
	const { addItem, items } = useCart();
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [alreadyAdded, setAlreadyAdded] = useState<boolean>(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setIsSuccess(false);
		}, 2000);

		return () => clearTimeout(timeout);
	}, [isSuccess]);

	useEffect(() => {
		setAlreadyAdded(!!items.find((i) => i.product.id === product.id));
	}, [isSuccess, items]);

	return (
		<Button
			onClick={() => {
				addItem(product)
				setIsSuccess(true)
			}}
			disabled={alreadyAdded}
			size='lg'
			className='w-full'>
			{isSuccess || alreadyAdded ? 'Added!' : 'Add to cart'}
		</Button>
	);
}

export default AddToCartButton;
